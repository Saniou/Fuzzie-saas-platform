'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Check, Trash2, Loader2, Workflow as WorkflowIcon } from 'lucide-react'
import {
  onRenameWorkflow,
  onFlowPublish,
  onDeleteWorkflow,
} from '../../workflows/_actions/workflow-connections'

type WorkflowItem = {
  id: string
  name: string
  publish: boolean | null
}

export default function WorkflowsManager({
  workflows,
}: {
  workflows: WorkflowItem[]
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  // Локальні значення полів імені (для перейменування)
  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(workflows.map((w) => [w.id, w.name]))
  )

  const rename = (id: string) =>
    start(async () => {
      const res = await onRenameWorkflow(id, names[id] ?? '')
      if (res.ok) {
        toast.success(res.message)
        router.refresh()
      } else toast.error(res.message)
    })

  const togglePublish = (id: string, state: boolean) =>
    start(async () => {
      try {
        const msg = await onFlowPublish(id, state)
        if (msg) toast.success(msg)
        router.refresh()
      } catch {
        toast.error('Failed to update publish state')
      }
    })

  const remove = (id: string) =>
    start(async () => {
      const res = await onDeleteWorkflow(id)
      if (res.ok) {
        toast.success(res.message)
        router.refresh()
      } else toast.error(res.message)
    })

  if (!workflows.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <WorkflowIcon className="h-8 w-8 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">No workflows yet</p>
        <Button asChild size="sm">
          <Link href="/workflows">Create one</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {workflows.map((wf) => {
        const changed = (names[wf.id] ?? '') !== wf.name
        const isPublished = !!wf.publish
        return (
          <div
            key={wf.id}
            className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-center"
          >
            {/* Rename */}
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={names[wf.id] ?? ''}
                onChange={(e) =>
                  setNames((m) => ({ ...m, [wf.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && changed) rename(wf.id)
                }}
                className="h-9"
              />
              <Button
                size="icon"
                variant="outline"
                disabled={!changed || pending}
                onClick={() => rename(wf.id)}
                title="Rename"
                className="shrink-0"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              {/* Publish / Disconnect */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`pub-${wf.id}`}
                  className="text-xs text-muted-foreground"
                >
                  {isPublished ? 'Live' : 'Off'}
                </Label>
                <Switch
                  id={`pub-${wf.id}`}
                  checked={isPublished}
                  disabled={pending}
                  onCheckedChange={(v) => togglePublish(wf.id, v)}
                />
              </div>

              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={pending}
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this workflow?</AlertDialogTitle>
                    <AlertDialogDescription>
                      &quot;{wf.name}&quot; and its run history will be permanently
                      removed. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => remove(wf.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )
      })}
    </div>
  )
}
