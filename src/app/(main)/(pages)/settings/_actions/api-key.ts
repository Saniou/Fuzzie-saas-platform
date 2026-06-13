'use server'

import { randomBytes } from 'crypto'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'

/** Генерує (або перевипускає) персональний Trigger-ключ для запуску воркфлоу ззовні. */
export const onGenerateApiKey = async (): Promise<{
  ok: boolean
  apiKey?: string
  message: string
}> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  const apiKey = `fz_${randomBytes(24).toString('hex')}`

  await db.user.update({
    where: { clerkId: user.id },
    data: { apiKey },
  })

  return { ok: true, apiKey, message: 'API key generated' }
}

/** Відкликає поточний ключ (робить запуск ззовні неможливим). */
export const onRevokeApiKey = async (): Promise<{
  ok: boolean
  message: string
}> => {
  const user = await currentUser()
  if (!user) return { ok: false, message: 'Not authenticated' }

  await db.user.update({
    where: { clerkId: user.id },
    data: { apiKey: null },
  })

  return { ok: true, message: 'API key revoked' }
}
