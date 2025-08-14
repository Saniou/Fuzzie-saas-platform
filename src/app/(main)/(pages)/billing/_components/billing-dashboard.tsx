"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Crown,
  Zap,
  Shield,
  Star,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const usageData = [
  { month: "Jan", usage: 65, cost: 120 },
  { month: "Feb", usage: 78, cost: 145 },
  { month: "Mar", usage: 90, cost: 180 },
  { month: "Apr", usage: 85, cost: 165 },
  { month: "May", usage: 95, cost: 195 },
  { month: "Jun", usage: 88, cost: 175 },
]

const paymentHistory = [
  { id: "1", date: "2024-01-15", amount: "$29.99", status: "Paid", method: "Visa ****4242", invoice: "INV-001" },
  { id: "2", date: "2024-02-15", amount: "$29.99", status: "Paid", method: "Visa ****4242", invoice: "INV-002" },
  { id: "3", date: "2024-03-15", amount: "$29.99", status: "Paid", method: "Visa ****4242", invoice: "INV-003" },
  { id: "4", date: "2024-04-15", amount: "$29.99", status: "Failed", method: "Visa ****4242", invoice: "INV-004" },
  { id: "5", date: "2024-05-15", amount: "$29.99", status: "Paid", method: "Visa ****4242", invoice: "INV-005" },
]

const plans = [
  {
    name: "Starter",
    price: "$9.99",
    period: "/month",
    features: ["5 Workflows", "1,000 Tasks/month", "Basic Support", "2 Team Members"],
    current: false,
    popular: false,
    color: "from-gray-500 to-gray-600",
  },
  {
    name: "Professional",
    price: "$29.99",
    period: "/month",
    features: ["25 Workflows", "10,000 Tasks/month", "Priority Support", "10 Team Members", "Advanced Analytics"],
    current: true,
    popular: true,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Enterprise",
    price: "$99.99",
    period: "/month",
    features: [
      "Unlimited Workflows",
      "Unlimited Tasks",
      "24/7 Support",
      "Unlimited Team Members",
      "Custom Integrations",
    ],
    current: false,
    popular: false,
    color: "from-yellow-500 to-yellow-600",
  },
]

const BillingDashboard = () => {
  const [selectedPlan, setSelectedPlan] = useState("Professional")
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 space-y-8">
      {/* Header Section */}
      <div className="animate-slide-in-up">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-montserrat font-black text-4xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Your Billing Overview
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 font-open-sans">
              <Crown className="w-4 h-4 mr-1" />
              Professional Plan
            </Badge>
            <Button
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 animate-pulse-glow font-open-sans font-semibold"
              onClick={() => setIsUpgradeDialogOpen(true)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground font-open-sans text-lg">
          Manage your subscriptions, track payments, and monitor usage analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-scale">
        {[
          { title: "Current Spend", value: "$29.99", change: "+0%", icon: DollarSign, color: "text-green-500" },
          { title: "Usage This Month", value: "8,547", change: "+12%", icon: Activity, color: "text-blue-500" },
          { title: "Active Workflows", value: "23", change: "+3", icon: Zap, color: "text-purple-500" },
          { title: "Team Members", value: "7", change: "+2", icon: Users, color: "text-orange-500" },
        ].map((stat, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 border-border/50 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-open-sans text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-montserrat font-bold">{stat.value}</p>
                  <p className={`text-sm font-open-sans ${stat.color} flex items-center mt-1`}>
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-muted/50 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="font-open-sans font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="font-open-sans font-medium">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="payments" className="font-open-sans font-medium">
            Payment History
          </TabsTrigger>
          <TabsTrigger value="usage" className="font-open-sans font-medium">
            Usage Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card className="border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat font-bold flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-500" />
                  Current Plan
                </CardTitle>
                <CardDescription className="font-open-sans">Your active subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
                  <div>
                    <h3 className="font-montserrat font-bold text-xl">Professional</h3>
                    <p className="text-muted-foreground font-open-sans">$29.99/month</p>
                  </div>
                  <Badge className="bg-purple-500 hover:bg-purple-600">
                    <Star className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-open-sans">
                    <span>Workflows Used</span>
                    <span>23/25</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-open-sans">
                    <span>Tasks This Month</span>
                    <span>8,547/10,000</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Next Payment */}
            <Card className="border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat font-bold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Next Payment
                </CardTitle>
                <CardDescription className="font-open-sans">Upcoming billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                  <div>
                    <h3 className="font-montserrat font-bold text-xl">$29.99</h3>
                    <p className="text-muted-foreground font-open-sans">Due January 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Auto-pay enabled
                    </Badge>
                    <p className="text-sm text-muted-foreground font-open-sans">Visa ****4242</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full font-open-sans bg-transparent">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Usage Chart */}
          <Card className="border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">Usage Trends</CardTitle>
              <CardDescription className="font-open-sans">Your monthly usage and costs over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  plan.current ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20" : ""
                } ${plan.popular ? "scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="font-montserrat font-bold text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-montserrat font-black">{plan.price}</span>
                    <span className="text-muted-foreground font-open-sans ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center font-open-sans text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-open-sans font-semibold ${
                      plan.current
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : `bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity duration-300`
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Upgrade to " + plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="border-border/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">Payment History</CardTitle>
              <CardDescription className="font-open-sans">Track all your transactions at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-open-sans font-semibold">Date</TableHead>
                    <TableHead className="font-open-sans font-semibold">Amount</TableHead>
                    <TableHead className="font-open-sans font-semibold">Status</TableHead>
                    <TableHead className="font-open-sans font-semibold">Method</TableHead>
                    <TableHead className="font-open-sans font-semibold">Invoice</TableHead>
                    <TableHead className="font-open-sans font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <TableCell className="font-open-sans">{payment.date}</TableCell>
                      <TableCell className="font-montserrat font-semibold">{payment.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={payment.status === "Paid" ? "default" : "destructive"}
                          className={payment.status === "Paid" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {payment.status === "Paid" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-open-sans">{payment.method}</TableCell>
                      <TableCell className="font-open-sans text-muted-foreground">{payment.invoice}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="font-open-sans">
                          <Download className="w-4 h-4 mr-1" />
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Monthly Usage</CardTitle>
                <CardDescription className="font-open-sans">Track your workflow and task consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="usage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Usage Insights</CardTitle>
                <CardDescription className="font-open-sans">Monitor your activity and optimize usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-sm">Workflows</span>
                    <span className="font-montserrat font-semibold">23/25</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-sm">Tasks</span>
                    <span className="font-montserrat font-semibold">8,547/10,000</span>
                  </div>
                  <Progress value={85} className="h-3" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-sm">Team Members</span>
                    <span className="font-montserrat font-semibold">7/10</span>
                  </div>
                  <Progress value={70} className="h-3" />
                </div>
                <Separator />
                <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="font-montserrat font-semibold text-green-500">Efficient Usage</p>
                  <p className="font-open-sans text-sm text-muted-foreground">
                    You're using resources efficiently this month
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-montserrat font-bold">Upgrade Your Plan</DialogTitle>
            <DialogDescription className="font-open-sans">Choose a plan that fits your growing needs</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professional">Professional - $29.99/month</SelectItem>
                <SelectItem value="Enterprise">Enterprise - $99.99/month</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 font-open-sans bg-transparent"
                onClick={() => setIsUpgradeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 font-open-sans font-semibold"
                onClick={() => setIsUpgradeDialogOpen(false)}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BillingDashboard
