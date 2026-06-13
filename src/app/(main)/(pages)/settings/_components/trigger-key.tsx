'use client'

import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  KeyRound,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Loader2,
  Zap,
} from 'lucide-react'
import { onGenerateApiKey, onRevokeApiKey } from '../_actions/api-key'

type Props = {
  apiKey: string | null
  appUrl: string
  workflows: { id: string; name: string }[]
}

export default function TriggerKey({ apiKey: initialKey, appUrl, workflows }: Props) {
  const [apiKey, setApiKey] = useState<string | null>(initialKey)
  const [revealed, setRevealed] = useState(false)
  const [workflowId, setWorkflowId] = useState(workflows[0]?.id ?? '')
  const [pending, start] = useTransition()

  const masked = apiKey
    ? `${apiKey.slice(0, 6)}${'•'.repeat(18)}${apiKey.slice(-4)}`
    : ''

  const triggerUrl =
    apiKey && workflowId
      ? `${appUrl}/api/trigger?key=${apiKey}&workflow=${workflowId}`
      : ''

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copied`)
  }

  const generate = () =>
    start(async () => {
      const res = await onGenerateApiKey()
      if (res.ok && res.apiKey) {
        setApiKey(res.apiKey)
        setRevealed(true)
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })

  const revoke = () =>
    start(async () => {
      const res = await onRevokeApiKey()
      if (res.ok) {
        setApiKey(null)
        setRevealed(false)
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Fire any of your workflows from outside the app — a cron job, a script, a
        button — with a single HTTP request. No login required, just this key.
      </p>

      {apiKey ? (
        <>
          {/* Key row */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Your trigger key
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={revealed ? apiKey : masked}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRevealed((v) => !v)}
                title={revealed ? 'Hide' : 'Reveal'}
              >
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(apiKey, 'Key')}
                title="Copy key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trigger URL builder */}
          {workflows.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">
                Trigger URL for a workflow
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={workflowId} onValueChange={setWorkflowId}>
                  <SelectTrigger className="sm:w-56">
                    <SelectValue placeholder="Pick a workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input readOnly value={triggerUrl} className="font-mono text-xs" />
                <Button
                  variant="outline"
                  onClick={() => copy(triggerUrl, 'Trigger URL')}
                  className="w-full gap-2 sm:w-auto"
                >
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Open that URL (or <span className="font-mono">curl</span> it) to run
                the workflow. Prefer POST with header{' '}
                <span className="font-mono">x-api-key</span> to keep the key out of
                the URL.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={generate}
              disabled={pending}
              className="w-full gap-2 sm:w-auto"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Regenerate
            </Button>
            <Button
              variant="ghost"
              onClick={revoke}
              disabled={pending}
              className="w-full gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            >
              <Trash2 className="h-4 w-4" /> Revoke
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-lg border bg-muted/20 p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <KeyRound className="h-5 w-5" />
            <span className="text-sm">No trigger key yet</span>
          </div>
          <Button onClick={generate} disabled={pending} className="gap-2">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Generate trigger key
          </Button>
        </div>
      )}
    </div>
  )
}
