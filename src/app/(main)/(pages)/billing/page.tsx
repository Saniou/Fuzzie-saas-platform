import React from 'react'
import BillingDashboard from './_components/billing-dashboard'

const Billing = async () => {

  return (
    <div className="flex flex-col gap-4 p-10">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Your Billing Overview</span>
      </h1>
      <BillingDashboard />
    </div>
  )
}

export default Billing