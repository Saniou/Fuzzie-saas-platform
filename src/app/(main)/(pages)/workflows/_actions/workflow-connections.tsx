'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs/server'
import { executeWorkflow, logWorkflowRun } from '@/lib/workflow-executor'

export const getGoogleListener = async () => {
  const { userId } = await auth()

  if (userId) {
    const listener = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        googleResourceId: true,
      },
    })

    if (listener) return listener
  }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  console.log(state)
  const published = await db.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  })

  if (published.publish) return 'Workflow published'
  return 'Workflow unpublished'
}

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  if (type === 'Discord') {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        discordTemplate: content,
      },
    })

    if (response) {
      return 'Discord template saved'
    }
  }
  if (type === 'Slack') {
    // Зберігаємо текст, токен і вибрані канали одним апдейтом.
    // slackChannels замінюємо поточним вибором (без дублів) — надійніше за
    // криву push-логіку оригіналу, через яку канал часто не зберігався.
    const channelIds = Array.from(
      new Set((channels ?? []).map((c) => c.value))
    )

    const response = await db.workflows.update({
      where: { id: workflowId },
      data: {
        slackTemplate: content,
        slackAccessToken: accessToken,
        slackChannels: channelIds,
      },
    })

    if (response) return 'Slack template saved'
  }

  if (type === 'Notion') {
    const response = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        notionTemplate: content,
        notionAccessToken: accessToken,
        notionDbId: notionDbId,
      },
    })

    if (response) return 'Notion template saved'
  }
}

export const onGetWorkflows = async () => {
  const user = await currentUser()
  if (user) {
    const workflow = await db.workflows.findMany({
      where: {
        userId: user.id,
      },
    })

    if (workflow) return workflow
  }
}

export const onCreateWorkflow = async (name: string, description: string) => {
  const user = await currentUser()

  if (user) {
    //create new workflow
    const workflow = await db.workflows.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    })

    if (workflow) return { message: 'workflow created' }
    return { message: 'Oops! try again' }
  }
}

export const onRenameWorkflow = async (
  workflowId: string,
  name: string
): Promise<{ ok: boolean; message: string }> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  const trimmed = name.trim()
  if (!trimmed) return { ok: false, message: 'Name cannot be empty' }

  const result = await db.workflows.updateMany({
    where: { id: workflowId, userId: user.id },
    data: { name: trimmed },
  })

  if (result.count === 0) return { ok: false, message: 'Workflow not found' }
  return { ok: true, message: 'Workflow renamed' }
}

export const onDeleteWorkflow = async (
  workflowId: string
): Promise<{ ok: boolean; message: string }> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  // Видаляємо лише власний воркфлоу; повʼязані WorkflowRun підуть каскадом
  const result = await db.workflows.deleteMany({
    where: { id: workflowId, userId: user.id },
  })

  if (result.count === 0) return { ok: false, message: 'Workflow not found' }
  return { ok: true, message: 'Workflow deleted' }
}

export const onGetNodesEdges = async (flowId: string) => {
  const nodesEdges = await db.workflows.findUnique({
    where: {
      id: flowId,
    },
    select: {
      nodes: true,
      edges: true,
    },
  })
  if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
}

/**
 * Ручний запуск воркфлоу ("Run now"): виконує flowPath, пише лог прогону у
 * WorkflowRun і списує кредит. Дає змогу протестувати автоматизацію й одразу
 * побачити результат на сторінці Logs — без налаштування Google Drive watch.
 */
export const onRunWorkflow = async (
  workflowId: string
): Promise<{ ok: boolean; status?: string; message: string }> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: { credits: true },
  })
  const credits = dbUser?.credits ?? '0'
  const hasCredits = credits === 'Unlimited' || parseInt(credits) > 0
  if (!hasCredits) return { ok: false, message: 'You are out of credits' }

  const flow = await db.workflows.findFirst({
    where: { id: workflowId, userId: user.id },
  })
  if (!flow) return { ok: false, message: 'Workflow not found' }
  if (!flow.flowPath)
    return {
      ok: false,
      message: 'Nothing to run — open the editor and Save your flow first',
    }

  const result = await executeWorkflow(flow)
  await logWorkflowRun(flow, result)

  if (credits !== 'Unlimited') {
    await db.user.update({
      where: { clerkId: user.id },
      data: { credits: `${parseInt(credits) - 1}` },
    })
  }

  return { ok: result.status !== 'error', status: result.status, message: result.message }
}
