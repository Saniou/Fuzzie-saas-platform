import { PrismaClient, Prisma } from '@prisma/client'

// Коди помилок підключення (типові для cold-start Neon, який засинає на free tier)
const RETRYABLE_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017'])

const isRetryable = (e: unknown): boolean => {
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return !e.errorCode || RETRYABLE_CODES.has(e.errorCode)
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return RETRYABLE_CODES.has(e.code)
  }
  return false
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Prisma-клієнт із глобальним ретраєм на помилки підключення. Neon на
 * безкоштовному тарифі присипляє compute після простою — перший запит падає з
 * P1001, поки база прокидається. Замість краху сторінки чекаємо й повторюємо.
 */
const createPrismaClient = () =>
  new PrismaClient().$extends({
    query: {
      async $allOperations({ args, query }) {
        const delays = [500, 1200, 2500] // ~4с сумарно — вистачає на пробудження Neon
        let lastError: unknown
        for (let attempt = 0; attempt <= delays.length; attempt++) {
          try {
            return await query(args)
          } catch (error) {
            if (!isRetryable(error) || attempt === delays.length) throw error
            lastError = error
            await sleep(delays[attempt])
          }
        }
        throw lastError
      },
    },
  })

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined
}

export const db = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
