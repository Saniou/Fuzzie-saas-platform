import { db } from '@/lib/db'
import axios from 'axios'
import type { Workflows } from '@prisma/client'
import { postContentToWebHook } from '@/app/(main)/(pages)/connections/_actions/discord-connection'
import { onCreateNewPageInDatabase } from '@/app/(main)/(pages)/connections/_actions/notion-connection'
import { postMessageToSlack } from '@/app/(main)/(pages)/connections/_actions/slack-connection'

export type RunStatus = 'success' | 'partial' | 'error' | 'skipped'

export type RunResult = {
  status: RunStatus
  actions: string[]
  message: string
}

/**
 * Проганяє flowPath воркфлоу: послідовно виконує дії (Discord/Slack/Notion),
 * а на кроці Wait планує відкладене продовження. Повертає підсумок прогону —
 * НЕ списує кредити і НЕ пише лог (це робить викликач), щоб логіку можна було
 * перевикористати і у вебхуці Google Drive, і в ручному запуску "Run now".
 */
export async function executeWorkflow(
  flow: Workflows,
  stepsOverride?: string[]
): Promise<RunResult> {
  // stepsOverride використовується при відновленні після Wait (з cronPath)
  const path: string[] = stepsOverride ?? JSON.parse(flow.flowPath ?? '[]')
  const executed: string[] = []
  const errors: string[] = []
  let current = 0

  while (current < path.length) {
    const step = path[current]
    try {
      if (step === 'Discord') {
        const discord = await db.discordWebhook.findFirst({
          where: { userId: flow.userId },
          select: { url: true },
        })
        if (!discord) throw new Error('Discord is not connected')
        await postContentToWebHook(flow.discordTemplate ?? '', discord.url)
        executed.push('Discord')
      } else if (step === 'Slack') {
        if (!flow.slackAccessToken) throw new Error('Slack is not connected')
        const channels = flow.slackChannels.map((c) => ({ label: '', value: c }))
        await postMessageToSlack(
          flow.slackAccessToken,
          channels,
          flow.slackTemplate ?? ''
        )
        executed.push('Slack')
      } else if (step === 'Notion') {
        if (!flow.notionDbId || !flow.notionAccessToken)
          throw new Error('Notion is not connected')
        await onCreateNewPageInDatabase(
          flow.notionDbId,
          flow.notionAccessToken,
          JSON.parse(flow.notionTemplate ?? '{}')
        )
        executed.push('Notion')
      } else if (step === 'Wait') {
        // Планувальник cron-job.org (опційно — лише якщо налаштовано)
        if (process.env.CRON_JOB_KEY && process.env.NGROK_URI) {
          await axios.put(
            'https://api.cron-job.org/jobs',
            {
              job: {
                url: `${process.env.NGROK_URI}/api/cron/wait?flow_id=${flow.id}`,
                enabled: 'true',
                schedule: {
                  timezone: 'Europe/Istanbul',
                  expiresAt: 0,
                  hours: [-1],
                  mdays: [-1],
                  minutes: [-1],
                  months: [-1],
                  wdays: [-1],
                },
              },
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.CRON_JOB_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          )
        }
        // Зберігаємо решту кроків після Wait для відновлення cron-задачею
        await db.workflows.update({
          where: { id: flow.id },
          data: { cronPath: JSON.stringify(path.slice(current + 1)) },
        })
        executed.push('Wait')
        break
      }
    } catch (error: any) {
      errors.push(`${step}: ${error?.message ?? 'failed'}`)
    }
    current++
  }

  let status: RunStatus
  if (!executed.length && !errors.length) status = 'skipped'
  else if (errors.length && executed.length) status = 'partial'
  else if (errors.length) status = 'error'
  else status = 'success'

  const message = errors.length
    ? errors.join('; ')
    : executed.length
    ? `Executed: ${executed.join(', ')}`
    : 'No actions to run'

  return { status, actions: executed, message }
}

/** Записує підсумок прогону у таблицю WorkflowRun (історія для сторінки Logs). */
export async function logWorkflowRun(
  flow: Pick<Workflows, 'id' | 'name' | 'userId'>,
  result: RunResult
) {
  await db.workflowRun.create({
    data: {
      workflowId: flow.id,
      workflowName: flow.name,
      userId: flow.userId,
      status: result.status,
      actions: result.actions,
      message: result.message,
    },
  })
}
