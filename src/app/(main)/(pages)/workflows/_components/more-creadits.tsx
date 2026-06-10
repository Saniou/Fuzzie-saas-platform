'use client'
import React from 'react'
import Link from 'next/link'
import { useBilling } from '@/providers/billing-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

type Props = {}

const MoreCredits = (props: Props) => {
  const { credits, tier } = useBilling()

  // Unlimited або є кредити — нічого не показуємо
  if (tier === 'Unlimited' || credits !== '0') return <></>

  return (
    <Card className="border-2 border-destructive/30 bg-gradient-to-br from-destructive/5 to-card">
      <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">You are out of credits</p>
            <p className="text-sm text-muted-foreground">
              Upgrade your plan to keep your automations running.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/billing">Upgrade plan</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default MoreCredits
