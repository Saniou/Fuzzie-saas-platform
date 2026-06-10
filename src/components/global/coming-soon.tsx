import { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  description: string
  icon: LucideIcon
}

/**
 * Заглушка для сторінок у розробці (Templates, Logs тощо) у стилі дашборда.
 */
export default function ComingSoon({ title, description, icon: Icon }: Props) {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <h1 className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 p-4 text-3xl font-bold backdrop-blur-lg md:p-6 md:text-4xl">
        {title}
      </h1>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border-2 bg-gradient-to-br from-card to-card/50 p-10 text-center shadow-lg animate-in fade-in-50 zoom-in-95 duration-500">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Coming soon</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <span className="rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            🚧 In development
          </span>
        </div>
      </div>
    </div>
  )
}
