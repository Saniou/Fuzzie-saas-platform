'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { getTemplateById } from '@/lib/templates'

/**
 * Клонує готовий шаблон у власний воркфлоу користувача: створює Workflows-рядок
 * з готовими nodes/edges/flowPath і дефолтними повідомленнями для дій.
 */
export const onCloneTemplate = async (
  templateId: string
): Promise<{ ok: boolean; id?: string; message: string }> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  const template = getTemplateById(templateId)
  if (!template) return { ok: false, message: 'Template not found' }

  const workflow = await db.workflows.create({
    data: {
      userId: user.id,
      name: template.name,
      description: template.description,
      nodes: JSON.stringify(template.nodes),
      edges: JSON.stringify(template.edges),
      flowPath: JSON.stringify(template.flowPath),
      discordTemplate: template.actions.includes('Discord')
        ? template.message
        : undefined,
      slackTemplate: template.actions.includes('Slack')
        ? template.message
        : undefined,
      notionTemplate: template.actions.includes('Notion')
        ? JSON.stringify(template.message)
        : undefined,
    },
  })

  return {
    ok: true,
    id: workflow.id,
    message: 'Template added to your workflows',
  }
}
