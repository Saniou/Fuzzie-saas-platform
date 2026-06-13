import { db } from '@/lib/db'
import { executeWorkflow, logWorkflowRun } from '@/lib/workflow-executor'
import { NextRequest } from 'next/server'

/**
 * Зовнішній запуск воркфлоу за персональним Trigger-ключем (без Clerk-сесії).
 * Дає змогу смикати автоматизацію з cron, скрипта, кнопки тощо.
 *
 *   GET  /api/trigger?key=fz_...&workflow=<id>
 *   POST /api/trigger      (header: x-api-key: fz_...,  body: { workflowId })
 */
async function runByKey(key: string | null, workflowId: string | null) {
  if (!key) return Response.json({ message: 'Missing API key' }, { status: 401 })
  if (!workflowId)
    return Response.json({ message: 'Missing workflow id' }, { status: 400 })

  const user = await db.user.findUnique({
    where: { apiKey: key },
    select: { clerkId: true, credits: true },
  })
  if (!user) return Response.json({ message: 'Invalid API key' }, { status: 401 })

  const hasCredits =
    user.credits === 'Unlimited' || parseInt(user.credits ?? '0') > 0
  if (!hasCredits)
    return Response.json({ message: 'Out of credits' }, { status: 402 })

  const flow = await db.workflows.findFirst({
    where: { id: workflowId, userId: user.clerkId },
  })
  if (!flow)
    return Response.json({ message: 'Workflow not found' }, { status: 404 })

  const result = await executeWorkflow(flow)
  await logWorkflowRun(flow, result)

  if (user.credits !== 'Unlimited') {
    await db.user.update({
      where: { clerkId: user.clerkId },
      data: { credits: `${parseInt(user.credits ?? '0') - 1}` },
    })
  }

  return Response.json(
    { status: result.status, actions: result.actions, message: result.message },
    { status: result.status === 'error' ? 422 : 200 }
  )
}

export async function GET(req: NextRequest) {
  const key =
    req.headers.get('x-api-key') ?? req.nextUrl.searchParams.get('key')
  const workflowId = req.nextUrl.searchParams.get('workflow')
  return runByKey(key, workflowId)
}

export async function POST(req: NextRequest) {
  const key =
    req.headers.get('x-api-key') ?? req.nextUrl.searchParams.get('key')
  let workflowId = req.nextUrl.searchParams.get('workflow')
  if (!workflowId) {
    const body = await req.json().catch(() => null)
    workflowId = body?.workflowId ?? body?.workflow ?? null
  }
  return runByKey(key, workflowId)
}
