'use client'
import React, { useEffect } from 'react'
import { Book, Headphones, Search, Sparkles } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { UserButton } from '@clerk/nextjs'
import { useBilling } from '@/providers/billing-provider'
import { onPaymentDetails } from '@/app/(main)/(pages)/billing/_action/payment-connections'

type Props = {}

const InfoBar = (props: Props) => {
  const { credits, tier, setCredits, setTier } = useBilling()
  const [loaded, setLoaded] = React.useState(false)

  // Тягнемо реальні tier/credits користувача з БД і наповнюємо BillingProvider.
  useEffect(() => {
    const onGetPayment = async () => {
      const response = await onPaymentDetails()
      if (response) {
        setTier(response.tier ?? 'Free')
        setCredits(response.credits ?? '0')
      }
      setLoaded(true)
    }
    onGetPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const creditCap = tier === 'Pro' ? '100' : '10'
  const creditLabel =
    tier === 'Unlimited' ? 'Unlimited' : `${credits}/${creditCap}`

  return (
    <header className="sticky top-0 z-20 flex w-full flex-row items-center justify-end gap-4 border-b bg-background/70 px-4 py-3 backdrop-blur-xl">
      {/* Кредити */}
      <div className="flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1.5 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Credits</span>
        {loaded ? (
          <span className="font-bold">{creditLabel}</span>
        ) : (
          <Skeleton className="h-4 w-10" />
        )}
      </div>

      {/* Пошук */}
      <div className="hidden items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors focus-within:border-primary/50 md:flex">
        <Search className="h-4 w-4" />
        <input
          placeholder="Quick Search"
          className="w-40 border-none bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Дії */}
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
              <Headphones className="h-[18px] w-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Contact Support</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
              <Book className="h-[18px] w-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Guide</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UserButton />
    </header>
  )
}

export default InfoBar
