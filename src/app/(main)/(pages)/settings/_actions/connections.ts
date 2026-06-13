'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export type IntegrationStatus = {
  google: boolean
  discord: boolean
  slack: boolean
  notion: boolean
}

/** Статус інтеграцій (Google завжди true — підключається через Clerk-OAuth). */
export const getIntegrationStatus = async (): Promise<IntegrationStatus> => {
  const user = await currentUser()
  if (!user) return { google: false, discord: false, slack: false, notion: false }

  const clerkId = user.id
  const [discord, slack, notion] = await Promise.all([
    db.discordWebhook.count({ where: { userId: clerkId } }),
    db.slack.count({ where: { userId: clerkId } }),
    db.notion.count({ where: { userId: clerkId } }),
  ])

  return {
    google: true,
    discord: discord > 0,
    slack: slack > 0,
    notion: notion > 0,
  }
}

export type DisconnectService = 'discord' | 'slack' | 'notion'

/** Відключає інтеграцію: видаляє токен/вебхук і повʼязаний Connections-рядок. */
export const onDisconnect = async (
  service: DisconnectService
): Promise<{ ok: boolean; message: string }> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  const clerkId = user.id
  try {
    if (service === 'discord') {
      await db.connections.deleteMany({
        where: { userId: clerkId, type: 'Discord' },
      })
      await db.discordWebhook.deleteMany({ where: { userId: clerkId } })
    } else if (service === 'slack') {
      await db.connections.deleteMany({
        where: { userId: clerkId, type: 'Slack' },
      })
      await db.slack.deleteMany({ where: { userId: clerkId } })
    } else if (service === 'notion') {
      await db.connections.deleteMany({
        where: { userId: clerkId, type: 'Notion' },
      })
      await db.notion.deleteMany({ where: { userId: clerkId } })
    }
    return { ok: true, message: `${service} disconnected` }
  } catch (e: any) {
    console.error('Disconnect failed:', e)
    return { ok: false, message: e?.message ?? 'Failed to disconnect' }
  }
}
