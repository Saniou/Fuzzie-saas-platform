'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import type { WorkflowRun } from '@prisma/client'

/** Повертає історію прогонів воркфлоу поточного користувача (найновіші зверху). */
export const getWorkflowRuns = async (): Promise<WorkflowRun[]> => {
  const user = await currentUser()
  if (!user) return []

  return db.workflowRun.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}
