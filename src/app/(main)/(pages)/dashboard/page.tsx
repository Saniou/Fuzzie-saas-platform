import React from 'react'
import { DashboardContent } from './_components/dashboard-content'
import { getDashboardData } from './_actions/dashboard-connections'

const DashboardPage = async () => {
  const data = await getDashboardData()

  return (
    <div className="flex flex-col gap-4 relative p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl sticky top-0 z-[10] p-4 md:p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      <p className="px-4 md:px-6 text-muted-foreground animate-in slide-in-from-left-4 duration-700 delay-100">
        Welcome back! Here's what's happening with your automations.
      </p>
      {data ? (
        <DashboardContent data={data} />
      ) : (
        <p className="px-4 md:px-6 text-muted-foreground">Unable to load your data.</p>
      )}
    </div>
  )
}

export default DashboardPage