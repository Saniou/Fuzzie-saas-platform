import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { getWorkflowRuns } from './_actions/get-logs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ScrollText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MinusCircle,
  Clock,
} from 'lucide-react'

const STATUS_META: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  success: {
    label: 'Success',
    className: 'border-green-500/30 bg-green-500/10 text-green-500',
    icon: CheckCircle2,
  },
  partial: {
    label: 'Partial',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    icon: AlertTriangle,
  },
  error: {
    label: 'Error',
    className: 'border-destructive/30 bg-destructive/10 text-destructive',
    icon: XCircle,
  },
  skipped: {
    label: 'Skipped',
    className: 'border-muted-foreground/30 bg-muted text-muted-foreground',
    icon: MinusCircle,
  },
}

const LogsPage = async () => {
  const runs = await getWorkflowRuns()

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <h1 className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 p-4 md:p-6 text-3xl md:text-4xl font-bold backdrop-blur-lg">
        Logs
      </h1>

      <div className="p-2 md:p-6">
        {runs.length ? (
          <div className="flex flex-col gap-3">
            {runs.map((run, index) => {
              const meta = STATUS_META[run.status] ?? STATUS_META.skipped
              const Icon = meta.icon
              return (
                <div
                  key={run.id}
                  className="flex flex-col gap-3 rounded-xl border-2 bg-gradient-to-br from-card to-card/50 p-4 transition-all duration-300 hover:shadow-lg animate-in slide-in-from-bottom-2 sm:flex-row sm:items-center sm:justify-between"
                  style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${meta.className}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{run.workflowName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {run.message}
                      </p>
                      {run.actions.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {run.actions.map((action, i) => (
                            <span
                              key={`${action}-${i}`}
                              className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 pl-12 sm:pl-0">
                    <Badge variant="outline" className={meta.className}>
                      {meta.label}
                    </Badge>
                    <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(run.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border-2 bg-gradient-to-br from-card to-card/50 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ScrollText className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No runs yet</h2>
              <p className="max-w-md text-muted-foreground">
                Execution logs appear here every time a workflow runs. Hit{' '}
                <span className="font-medium text-foreground">Run</span> on any
                workflow to try it now.
              </p>
            </div>
            <Button asChild>
              <Link href="/workflows">Go to Workflows</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogsPage
