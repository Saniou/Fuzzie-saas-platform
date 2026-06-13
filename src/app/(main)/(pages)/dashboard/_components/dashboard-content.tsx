'use client'

import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Workflow as WorkflowIcon,
  Rocket,
  Plug,
  Sparkles,
  Plus,
  ArrowRight,
  BarChart3,
  CalendarIcon,
  CheckCircle2,
  FileText,
  Link2,
  Settings,
  CreditCard,
} from 'lucide-react'
import type { DashboardData } from '../_actions/dashboard-connections'

type Props = {
  data: DashboardData
}

export function DashboardContent({ data }: Props) {
  const {
    tier,
    credits,
    workflowsCount,
    publishedCount,
    connectionsCount,
    runsCount,
    successCount,
    workflows,
    recentRuns,
  } = data

  const successRate = runsCount ? Math.round((successCount / runsCount) * 100) : 0

  const draftCount = Math.max(workflowsCount - publishedCount, 0)
  const isUnlimited = tier === 'Unlimited'
  const creditCap = tier === 'Pro' ? 100 : 10
  const creditsNum = isUnlimited ? creditCap : parseInt(credits || '0', 10) || 0
  const creditsPct = isUnlimited ? 100 : Math.round((creditsNum / creditCap) * 100)
  const publishedPct = workflowsCount
    ? Math.round((publishedCount / workflowsCount) * 100)
    : 0

  const stats = [
    {
      title: 'Workflows',
      value: String(workflowsCount),
      sub: `${draftCount} draft${draftCount === 1 ? '' : 's'}`,
      icon: WorkflowIcon,
    },
    {
      title: 'Published',
      value: String(publishedCount),
      sub: `of ${workflowsCount} total`,
      icon: Rocket,
    },
    {
      title: 'Connections',
      value: String(connectionsCount),
      sub: 'active integrations',
      icon: Plug,
    },
    {
      title: 'Credits',
      value: isUnlimited ? '∞' : credits,
      sub: `${tier} plan`,
      icon: Sparkles,
    },
  ]

  const recentWorkflows = workflows.slice(0, 5)

  const quickActions = [
    { label: 'New Workflow', href: '/workflows', icon: Plus },
    { label: 'Connections', href: '/connections', icon: Link2 },
    { label: 'Billing', href: '/billing', icon: CreditCard },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Дії */}
      <div className="flex flex-wrap items-center justify-end gap-2 animate-in slide-in-from-top-4 duration-700">
        <Button asChild className="hover:scale-105 transition-transform duration-300">
          <Link href="/workflows">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="group border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2 transition-colors duration-300 group-hover:bg-primary/20">
                  <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Статус воркфлоу + кредити */}
            <Card className="lg:col-span-4 border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Overview
                </CardTitle>
                <CardDescription>
                  Your automation status at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium">
                      {publishedCount}/{workflowsCount}
                    </span>
                  </div>
                  <Progress value={publishedPct} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Credits left</span>
                    <span className="font-medium">
                      {isUnlimited ? 'Unlimited' : `${creditsNum}/${creditCap}`}
                    </span>
                  </div>
                  <Progress value={creditsPct} className="h-2" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="min-w-0 rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xl font-bold">{workflowsCount}</p>
                    <p className="text-xs text-muted-foreground">Workflows</p>
                  </div>
                  <div className="min-w-0 rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xl font-bold">{draftCount}</p>
                    <p className="text-xs text-muted-foreground">Drafts</p>
                  </div>
                  <div className="min-w-0 rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xl font-bold">{connectionsCount}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Останні воркфлоу */}
            <Card className="lg:col-span-3 border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WorkflowIcon className="h-5 w-5 text-primary" />
                  Recent Workflows
                </CardTitle>
                <CardDescription>Jump back into your automations</CardDescription>
              </CardHeader>
              <CardContent>
                {recentWorkflows.length ? (
                  <div className="space-y-2">
                    {recentWorkflows.map((wf, index) => (
                      <Link
                        key={wf.id}
                        href={`/workflows/editor/${wf.id}`}
                        className="group flex items-center justify-between gap-2 rounded-lg p-2 transition-colors hover:bg-muted/50 animate-in slide-in-from-right-4"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium group-hover:text-primary">
                            {wf.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {wf.description}
                          </p>
                        </div>
                        <Badge variant={wf.publish ? 'default' : 'secondary'}>
                          {wf.publish ? 'Live' : 'Draft'}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={WorkflowIcon}
                    title="No workflows yet"
                    cta="Create your first workflow"
                    href="/workflows"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WORKFLOWS */}
        <TabsContent value="workflows" className="space-y-4">
          <Card className="border-2 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Workflow Management</CardTitle>
                <CardDescription>Manage your automation workflows</CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/workflows">
                  Open <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {workflows.length ? (
                <div className="space-y-2">
                  {workflows.map((wf, index) => (
                    <Link
                      key={wf.id}
                      href={`/workflows/editor/${wf.id}`}
                      className="group flex items-center justify-between gap-4 rounded-lg border p-4 transition-all duration-300 hover:bg-muted/50 animate-in slide-in-from-left-4"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="min-w-0">
                        <h4 className="truncate font-medium group-hover:text-primary">
                          {wf.name}
                        </h4>
                        <p className="truncate text-sm text-muted-foreground">
                          {wf.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Badge variant={wf.publish ? 'default' : 'secondary'}>
                          {wf.publish ? 'Live' : 'Draft'}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={WorkflowIcon}
                  title="No workflows yet"
                  cta="Create your first workflow"
                  href="/workflows"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS — реальні прогони */}
        <TabsContent value="analytics" className="space-y-4">
          {runsCount ? (
            <div className="grid gap-6 lg:grid-cols-7">
              <Card className="lg:col-span-3 border-2 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Run Stats
                  </CardTitle>
                  <CardDescription>Across all your workflows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-muted/30 p-4 text-center">
                      <p className="text-2xl font-bold">{runsCount}</p>
                      <p className="text-xs text-muted-foreground">Total runs</p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-4 text-center">
                      <p className="text-2xl font-bold text-green-500">{successCount}</p>
                      <p className="text-xs text-muted-foreground">Successful</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success rate</span>
                      <span className="font-medium">{successRate}%</span>
                    </div>
                    <Progress value={successRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-4 border-2 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle>Recent runs</CardTitle>
                  <CardDescription>Latest workflow executions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentRuns.map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-muted/50"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              run.status === 'success'
                                ? 'bg-green-500'
                                : run.status === 'partial'
                                ? 'bg-amber-500'
                                : run.status === 'error'
                                ? 'bg-destructive'
                                : 'bg-muted-foreground'
                            }`}
                          />
                          <span className="truncate text-sm font-medium">
                            {run.workflowName}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(run.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                    <Link href="/logs">View all logs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-2 bg-gradient-to-br from-card to-card/50">
              <CardContent>
                <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 opacity-40" />
                  <p className="font-medium">No run data yet</p>
                  <p className="text-sm">
                    Hit <span className="font-medium text-foreground">Run</span> on a
                    workflow to see analytics here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* REPORTS — чесна заглушка */}
        <TabsContent value="reports">
          <Card className="border-2 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[280px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <FileText className="h-12 w-12 opacity-40" />
                <p className="font-medium">Reports coming soon</p>
                <p className="text-sm">Export your automation history once runs are tracked.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick actions */}
      <Card className="border-2 bg-gradient-to-br from-card to-card/50 animate-in slide-in-from-bottom-4 duration-700 delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks at your fingertips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  asChild
                  variant="outline"
                  className="justify-start bg-transparent transition-transform duration-300 hover:scale-105"
                >
                  <Link href={action.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  cta,
  href,
}: {
  icon: React.ElementType
  title: string
  cta: string
  href: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">Get started in a click</p>
      </div>
      <Button asChild size="sm">
        <Link href={href}>
          {cta} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
