'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

export type DashboardData = {
  tier: string
  credits: string
  workflowsCount: number
  publishedCount: number
  connectionsCount: number
  runsCount: number
  successCount: number
  workflows: {
    id: string
    name: string
    description: string
    publish: boolean | null
  }[]
  recentRuns: {
    id: string
    workflowName: string
    status: string
    createdAt: Date
  }[]
}

/**
 * Агрегує реальні метрики дашборда для поточного користувача:
 * к-сть воркфлоу (всього/опублікованих), активні інтеграції, тариф/кредити
 * та список воркфлоу. Замінює хардкод у dashboard-content.
 */
export const getDashboardData = async (): Promise<DashboardData | null> => {
  const user = await currentUser()
  if (!user) return null

  const clerkId = user.id

  const [dbUser, workflows, discord, slack, notion, runsCount, successCount, recentRuns] =
    await Promise.all([
      db.user.findUnique({
        where: { clerkId },
        select: { tier: true, credits: true },
      }),
      db.workflows.findMany({
        where: { userId: clerkId },
        select: { id: true, name: true, description: true, publish: true },
      }),
      db.discordWebhook.count({ where: { userId: clerkId } }),
      db.slack.count({ where: { userId: clerkId } }),
      db.notion.count({ where: { userId: clerkId } }),
      db.workflowRun.count({ where: { userId: clerkId } }),
      db.workflowRun.count({ where: { userId: clerkId, status: 'success' } }),
      db.workflowRun.findMany({
        where: { userId: clerkId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, workflowName: true, status: true, createdAt: true },
      }),
    ])

  return {
    tier: dbUser?.tier ?? 'Free',
    credits: dbUser?.credits ?? '0',
    workflowsCount: workflows.length,
    publishedCount: workflows.filter((w) => w.publish).length,
    // Google Drive завжди підключений (через Clerk OAuth) — рахуємо як на сторінці Connections
    connectionsCount:
      1 + (discord > 0 ? 1 : 0) + (slack > 0 ? 1 : 0) + (notion > 0 ? 1 : 0),
    runsCount,
    successCount,
    workflows,
    recentRuns,
  }
}
