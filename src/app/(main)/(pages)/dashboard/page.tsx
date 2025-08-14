import React from 'react'
import { DashboardContent } from './_components/dashboard-content'

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      <p className="p-6 text-muted-foreground animate-in slide-in-from-left-4 duration-700 delay-100">
        Welcome back! Here's what's happening with your automations.
      </p>
      <DashboardContent />
    </div>
  )
}

export default DashboardPage