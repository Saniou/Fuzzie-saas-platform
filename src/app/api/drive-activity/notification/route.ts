import { db } from '@/lib/db'
import { executeWorkflow, logWorkflowRun } from '@/lib/workflow-executor'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('🔴 Changed')
  const headersList = await headers()
  const channelResourceId = headersList.get('x-goog-resource-id')

  if (channelResourceId) {
    const user = await db.user.findFirst({
      where: { googleResourceId: channelResourceId },
      select: { clerkId: true, credits: true },
    })

    const hasCredits =
      user && (user.credits === 'Unlimited' || parseInt(user.credits ?? '0') > 0)

    if (user && hasCredits) {
      const workflows = await db.workflows.findMany({
        where: { userId: user.clerkId, publish: true },
      })

      await Promise.all(
        workflows.map(async (flow) => {
          // Виконуємо воркфлоу й пишемо лог прогону (історія для сторінки Logs)
          const result = await executeWorkflow(flow)
          await logWorkflowRun(flow, result)

          // Списуємо кредит (крім Unlimited)
          if (user.credits !== 'Unlimited') {
            await db.user.update({
              where: { clerkId: user.clerkId },
              data: { credits: `${parseInt(user.credits ?? '0') - 1}` },
            })
          }
        })
      )

      return Response.json({ message: 'flow completed' }, { status: 200 })
    }
  }

  return Response.json({ message: 'success' }, { status: 200 })
}
