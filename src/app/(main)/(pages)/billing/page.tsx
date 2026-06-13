import React from 'react'
import BillingDashboard from './_components/billing-dashboard'
import { getDashboardData } from '../dashboard/_actions/dashboard-connections'

const Billing = async () => {
  const data = await getDashboardData()

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-4 md:p-6 text-3xl md:text-4xl backdrop-blur-lg">
        <span>Your Billing Overview</span>
      </h1>
      {data ? (
        <BillingDashboard data={data} />
      ) : (
        <p className="text-muted-foreground">Unable to load your billing data.</p>
      )}
    </div>
  )
}

export default Billing