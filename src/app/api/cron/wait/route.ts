import { db } from '@/lib/db'
import { executeWorkflow, logWorkflowRun } from '@/lib/workflow-executor'
import { NextRequest } from 'next/server'

/**
 * Відновлює воркфлоу після кроку Wait. Cron-задача (cron-job.org), яку планує
 * executor, періодично пінгує цей роут із ?flow_id=. Беремо збережені у cronPath
 * кроки після Wait, виконуємо їх і пишемо лог прогону.
 *
 * Примітка: cron-задача не видаляється автоматично (її jobId ніде не
 * зберігається), але після виконання cronPath очищається, тож наступні пінги —
 * безпечний no-op.
 */
export async function GET(req: NextRequest) {
  const flowId = req.nextUrl.searchParams.get('flow_id')
  if (!flowId) {
    return Response.json({ message: 'flow_id is required' }, { status: 400 })
  }

  const flow = await db.workflows.findUnique({ where: { id: flowId } })
  if (!flow || !flow.cronPath) {
    return Response.json({ message: 'no pending steps' }, { status: 200 })
  }

  let remaining: string[]
  try {
    remaining = JSON.parse(flow.cronPath)
  } catch {
    remaining = []
  }

  // Очищаємо cronPath ДО виконання, щоб паралельні пінги не дублювали прогін
  await db.workflows.update({
    where: { id: flow.id },
    data: { cronPath: null },
  })

  if (!remaining.length) {
    return Response.json({ message: 'no pending steps' }, { status: 200 })
  }

  const result = await executeWorkflow(flow, remaining)
  await logWorkflowRun(flow, result)

  return Response.json(
    { message: 'resumed', status: result.status },
    { status: 200 }
  )
}
