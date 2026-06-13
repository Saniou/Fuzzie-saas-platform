'use client'

import React, { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { CheckCircle2, Loader2 } from 'lucide-react'
import {
  onDisconnect,
  type DisconnectService,
  type IntegrationStatus,
} from '../_actions/connections'

type Row = {
  key: keyof IntegrationStatus
  name: string
  icon: string
  disconnectable: boolean
}

const ROWS: Row[] = [
  { key: 'google', name: 'Google Drive', icon: '/googleDrive.png', disconnectable: false },
  { key: 'discord', name: 'Discord', icon: '/discord.png', disconnectable: true },
  { key: 'slack', name: 'Slack', icon: '/slack.png', disconnectable: true },
  { key: 'notion', name: 'Notion', icon: '/notion.png', disconnectable: true },
]

export default function ConnectionsManager({
  status,
}: {
  status: IntegrationStatus
}) {
  const router = useRouter()
  const [pending, start] = useTransition()

  const disconnect = (service: DisconnectService) =>
    start(async () => {
      try {
        const res = await onDisconnect(service)
        if (!res.ok) {
          toast.error(res.message)
          return
        }
        toast.success(res.message)
        router.refresh()
      } catch (e) {
        console.error(e)
        toast.error('Failed to disconnect')
      }
    })

  return (
    <div className="flex flex-col gap-3">
      {ROWS.map((row) => {
        const connected = status[row.key]
        return (
          <div
            key={row.key}
            className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3 sm:p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/40">
                <Image src={row.icon} alt={row.name} width={24} height={24} className="object-contain" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{row.name}</p>
                <p className="text-xs text-muted-foreground">
                  {connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {connected ? (
                <span className="hidden items-center gap-1 text-sm font-medium text-green-500 sm:flex">
                  <CheckCircle2 className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link href="/connections">Connect</Link>
                </Button>
              )}

              {connected && row.disconnectable && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disconnect'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect {row.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Workflows using {row.name} will stop sending until you
                        reconnect it from the Connections page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => disconnect(row.key as DisconnectService)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
