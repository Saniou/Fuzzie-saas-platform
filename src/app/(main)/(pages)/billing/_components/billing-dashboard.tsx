'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  CreditCard,
  TrendingUp,
  Crown,
  Zap,
  Shield,
  Star,
  CheckCircle,
  Sparkles,
  Workflow as WorkflowIcon,
  Plug,
  Receipt,
} from 'lucide-react'
import type { DashboardData } from '../../dashboard/_actions/dashboard-connections'

type Props = {
  data: DashboardData
}

type Plan = {
  name: string
  price: string
  period: string
  cap: number
  color: string
  popular?: boolean
  features: string[]
}

// Реальні тарифи застосунку (відповідають моделі User.tier / credits)
const PLANS: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    cap: 10,
    color: 'from-gray-500 to-gray-600',
    features: ['10 workflow runs / month', '3 integrations', 'Community support'],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    cap: 100,
    popular: true,
    color: 'from-purple-500 to-purple-600',
    features: [
      '100 workflow runs / month',
      'All integrations',
      'Unlimited workflows',
      'Priority support',
    ],
  },
  {
    name: 'Unlimited',
    price: '$99',
    period: '/mo',
    cap: Infinity,
    color: 'from-amber-500 to-amber-600',
    features: [
      'Unlimited workflow runs',
      'All integrations',
      'Early access features',
      '24/7 support',
    ],
  },
]

const BillingDashboard = ({ data }: Props) => {
  const { tier, credits, workflowsCount, publishedCount, connectionsCount } = data

  const isUnlimited = tier === 'Unlimited'
  const creditCap = tier === 'Pro' ? 100 : tier === 'Unlimited' ? Infinity : 10
  const creditsLeft = isUnlimited ? Infinity : parseInt(credits || '0', 10) || 0
  const creditsUsed = isUnlimited ? 0 : Math.max(creditCap - creditsLeft, 0)
  const creditsPct = isUnlimited ? 100 : Math.round((creditsLeft / creditCap) * 100)

  // Запуск Stripe-checkout буде під'єднано у Фазі 4 (потрібні реальні Stripe-ключі/ціни)
  const onUpgrade = () => {
    toast.info('Stripe checkout will be enabled once billing keys are connected.')
  }

  const stats = [
    {
      title: 'Current Plan',
      value: tier,
      icon: Crown,
      color: 'text-purple-500',
    },
    {
      title: 'Credits Left',
      value: isUnlimited ? '∞' : `${creditsLeft}/${creditCap}`,
      icon: Sparkles,
      color: 'text-green-500',
    },
    {
      title: 'Workflows',
      value: String(workflowsCount),
      icon: WorkflowIcon,
      color: 'text-blue-500',
    },
    {
      title: 'Connections',
      value: String(connectionsCount),
      icon: Plug,
      color: 'text-amber-500',
    },
  ]

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Crown className="mr-1 h-4 w-4" />
            {tier} Plan
          </Badge>
          {!isUnlimited && (
            <Button
              className="bg-gradient-to-r from-purple-500 to-purple-600 font-semibold transition-all duration-300 hover:from-purple-600 hover:to-purple-700"
              onClick={onUpgrade}
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          )}
        </div>
        <p className="text-base text-muted-foreground md:text-lg">
          Manage your subscription, track credit usage and your connected apps.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="rounded-full bg-muted/50 p-3 transition-transform duration-300 group-hover:scale-110">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        {/* OVERVIEW — реальні дані */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-2 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-500" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-4">
                  <div>
                    <h3 className="text-xl font-bold">{tier}</h3>
                    <p className="text-muted-foreground">
                      {isUnlimited ? 'Unlimited credits' : `${creditCap} credits / month`}
                    </p>
                  </div>
                  <Badge className="bg-purple-500 hover:bg-purple-600">
                    <Star className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credits used</span>
                    <span>
                      {isUnlimited ? '∞' : `${creditsUsed}/${creditCap}`}
                    </span>
                  </div>
                  <Progress value={isUnlimited ? 0 : 100 - creditsPct} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Published workflows</span>
                    <span>{publishedCount}/{workflowsCount}</span>
                  </div>
                  <Progress
                    value={workflowsCount ? (publishedCount / workflowsCount) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Usage
                </CardTitle>
                <CardDescription>Your account at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credits remaining</span>
                    <span className="font-semibold">
                      {isUnlimited ? 'Unlimited' : `${creditsLeft}/${creditCap}`}
                    </span>
                  </div>
                  <Progress value={creditsPct} className="h-3" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xl font-bold">{workflowsCount}</p>
                    <p className="text-xs text-muted-foreground">Workflows</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xl font-bold">{publishedCount}</p>
                    <p className="text-xs text-muted-foreground">Live</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3 text-center">
                    <p className="text-xl font-bold">{connectionsCount}</p>
                    <p className="text-xs text-muted-foreground">Apps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PLANS — реальні тарифи застосунку */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => {
              const current = plan.name === tier
              return (
                <Card
                  key={plan.name}
                  className={`relative border-2 bg-gradient-to-br from-card to-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    current ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {plan.popular && !current && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-1 text-white">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4 text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-black">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full font-semibold ${
                        current
                          ? 'cursor-not-allowed bg-muted text-muted-foreground'
                          : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                      }`}
                      disabled={current}
                      onClick={current ? undefined : onUpgrade}
                    >
                      {current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* PAYMENT HISTORY — чесна заглушка (зʼявиться зі Stripe у Фазі 4) */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="border-2 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Payment History
              </CardTitle>
              <CardDescription>Your transactions will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[260px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <CreditCard className="h-12 w-12 opacity-40" />
                <p className="font-medium">No payments yet</p>
                <p className="text-sm">
                  Once you upgrade, your invoices and receipts will be listed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BillingDashboard
