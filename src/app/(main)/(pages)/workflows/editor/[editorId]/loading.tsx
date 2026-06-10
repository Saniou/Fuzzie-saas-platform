import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex h-full w-full animate-in fade-in-50 duration-300">
      {/* Полотно редактора */}
      <div className="relative flex-1 bg-muted/20 p-6">
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <Skeleton className="h-28 w-72 rounded-xl" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-28 w-72 rounded-xl" />
        </div>
      </div>
      {/* Бічна панель налаштувань */}
      <div className="w-80 space-y-4 border-l p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
