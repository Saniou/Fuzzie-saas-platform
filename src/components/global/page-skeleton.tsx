import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  /** Заголовок сторінки-заглушки */
  title?: string
  /** Показувати ряд stat-карток зверху (як на дашборді) */
  stats?: boolean
  /** Кількість рядків-карток у контенті */
  rows?: number
}

/**
 * Універсальний прелоудер сторінки у стилі дашборда (картки з градієнтом,
 * м'які тіні). Використовується в loading.tsx кожного маршруту, щоб під час
 * серверного рендеру/запитів до БД користувач бачив каркас, а не білий екран.
 */
export default function PageSkeleton({ title, stats = false, rows = 4 }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        {title ? (
          <h1 className="text-4xl font-bold">{title}</h1>
        ) : (
          <Skeleton className="h-10 w-56" />
        )}
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-6"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      )}

      {/* Content rows */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-6"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
