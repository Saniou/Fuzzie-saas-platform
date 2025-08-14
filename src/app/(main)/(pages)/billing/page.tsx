import React from 'react'
import Stripe from 'stripe'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import BillingDashboard from './_components/billing-dashboard'

type Props = {
  searchParams?: Promise<{ [key: string]: string | undefined }>
}

const Billing = async ({ searchParams }: Props) => {
  const params = await searchParams

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Billing</span>
      </h1>
      <BillingDashboard />
    </div>
  )
}

export default Billing