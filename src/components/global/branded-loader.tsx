import { Zap } from 'lucide-react'

type Props = {
  /** Підпис під логотипом (напр. назва сторінки, що вантажиться) */
  label?: string
}

/**
 * Брендований повноекранний прелоудер fuzzie: пульсуючий логотип з орбітальним
 * кільцем, словознак і індетермінований індикатор. Використовується в loading.tsx
 * замість «голого» скелета.
 */
export default function BrandedLoader({ label = 'Loading your workspace' }: Props) {
  return (
    <div className="flex h-full min-h-[60vh] w-full flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex flex-col items-center gap-8 animate-in fade-in-50 zoom-in-95 duration-500">
        {/* Логотип з орбітальним кільцем і світінням */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* м'яке світіння */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-logo-pulse" />
          {/* орбітальне кільце */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40 animate-ring-spin" />
          {/* логотип */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/30 animate-logo-pulse">
            <Zap className="h-8 w-8" />
          </div>
        </div>

        {/* Словознак + індикатор */}
        <div className="flex flex-col items-center gap-4">
          <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            fuzzie.
          </span>

          {/* Індетермінований індикатор */}
          <div className="relative h-1 w-40 overflow-hidden rounded-full bg-muted">
            <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 animate-loader-bar" />
          </div>

          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  )
}
