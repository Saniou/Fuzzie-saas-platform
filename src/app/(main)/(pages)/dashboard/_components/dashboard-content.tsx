"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MoreHorizontal,
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Zap,
  Settings,
  Trash2,
  Edit,
  Copy,
  Share,
  Download,
  Filter,
  SortAsc,
  Eye,
  PlayCircle,
  PauseCircle,
  RefreshCw,
} from "lucide-react"

export function DashboardContent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedWorkflows, setSelectedWorkflows] = React.useState<string[]>([])

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Conversions",
      value: "12,234",
      change: "+19%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Growth Rate",
      value: "573",
      change: "+201",
      trend: "up",
      icon: TrendingUp,
    },
  ]

  const recentActivity = [
    { id: 1, action: "New user registered", time: "2 minutes ago", status: "success", icon: CheckCircle },
    { id: 2, action: "Payment processed", time: "5 minutes ago", status: "success", icon: CheckCircle },
    { id: 3, action: "Workflow completed", time: "12 minutes ago", status: "success", icon: CheckCircle },
    { id: 4, action: "Error in automation", time: "1 hour ago", status: "error", icon: AlertCircle },
    { id: 5, action: "Data sync completed", time: "2 hours ago", status: "success", icon: CheckCircle },
  ]

  const workflows = [
    { id: "1", name: "Email Campaign", status: "active", lastRun: "2 hours ago", success: 98 },
    { id: "2", name: "Data Backup", status: "paused", lastRun: "1 day ago", success: 100 },
    { id: "3", name: "User Onboarding", status: "active", lastRun: "30 minutes ago", success: 95 },
    { id: "4", name: "Report Generation", status: "error", lastRun: "3 hours ago", success: 87 },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-700">
        <div className="space-y-1">


        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="hover:scale-105 transition-transform duration-300 bg-transparent">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? date.toLocaleDateString() : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Dialog>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a new automation workflow. Choose from templates or start from scratch.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" placeholder="My Workflow" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="template" className="text-right">
                    Template
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="data">Data Processing</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" placeholder="Describe your workflow..." className="col-span-3" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-start" />
                  <Label htmlFor="auto-start">Start automatically after creation</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="hover:scale-105 transition-transform duration-300">
                  Create Workflow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-in slide-in-from-bottom-4 duration-700 border-0 bg-gradient-to-br from-card to-card/50 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-green-500 mr-1 animate-bounce" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={`${stat.trend === "up" ? "text-green-500" : "text-red-500"} font-medium`}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="transition-all duration-300">
            Overview
          </TabsTrigger>
          <TabsTrigger value="workflows" className="transition-all duration-300">
            Workflows
          </TabsTrigger>
          <TabsTrigger value="analytics" className="transition-all duration-300">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="transition-all duration-300">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Analytics Overview
                </CardTitle>
                <CardDescription>Your automation performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px] mx-auto" />
                      <Skeleton className="h-4 w-[200px] mx-auto" />
                    </div>
                    <TrendingUp className="w-12 h-12 mx-auto opacity-50 animate-pulse" />
                    <div className="space-y-2">
                      <p className="font-medium">Chart visualization would go here</p>
                      <p className="text-sm">Connect your data to see analytics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer animate-in slide-in-from-right-4 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className={`p-1 rounded-full transition-transform duration-300 group-hover:scale-110 ${activity.status === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.action}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </p>
                        </div>
                        <Badge
                          variant={activity.status === "success" ? "default" : "destructive"}
                          className="animate-pulse"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflow Management</CardTitle>
                  <CardDescription>Manage and monitor your automation workflows</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow, index) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 animate-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedWorkflows.includes(workflow.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedWorkflows([...selectedWorkflows, workflow.id])
                          } else {
                            setSelectedWorkflows(selectedWorkflows.filter((id) => id !== workflow.id))
                          }
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">Last run: {workflow.lastRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          workflow.status === "active"
                            ? "default"
                            : workflow.status === "paused"
                              ? "secondary"
                              : "destructive"
                        }
                        className="animate-pulse"
                      >
                        {workflow.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{workflow.success}% success</div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-300">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-300">
                          {workflow.status === "active" ? (
                            <PauseCircle className="w-4 h-4" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform duration-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:scale-105 transition-transform duration-300 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the workflow "{workflow.name}
                                " and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Comprehensive performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-16 h-16 mx-auto opacity-50 animate-pulse" />
                  <p>Advanced analytics coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-4">
                  <CalendarIcon className="w-16 h-16 mx-auto opacity-50 animate-pulse" />
                  <p>Report generation coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions & Settings
          </CardTitle>
          <CardDescription>Common tasks, workflows, and configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="workflows">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Workflow Templates
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-3 pt-4">
                  {[
                    {
                      title: "Email Automation",
                      description: "Set up automated email sequences",
                      progress: 75,
                      steps: "3 of 4 steps completed",
                    },
                    {
                      title: "Data Integration",
                      description: "Connect your data sources",
                      progress: 45,
                      steps: "2 of 5 sources connected",
                    },
                    {
                      title: "Social Media",
                      description: "Automate social media posting",
                      progress: null,
                      steps: null,
                    },
                  ].map((action, index) => (
                    <div
                      key={action.title}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-4 group"
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <h3 className="font-medium mb-2 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                        {action.title}
                        <MoreHorizontal className="w-4 h-4 opacity-50" />
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      {action.progress !== null ? (
                        <>
                          <Progress value={action.progress} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">{action.steps}</p>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent hover:scale-105 transition-transform duration-300"
                        >
                          Explore Templates
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="settings">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Dashboard Settings
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-refresh Dashboard</Label>
                      <p className="text-sm text-muted-foreground">Automatically refresh data every 30 seconds</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts for workflow failures</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Compact View</Label>
                      <p className="text-sm text-muted-foreground">Show more information in less space</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="actions">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Quick Actions
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 pt-4">
                  <Button
                    variant="outline"
                    className="justify-start hover:scale-105 transition-transform duration-300 bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Workflow
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start hover:scale-105 transition-transform duration-300 bg-transparent"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start hover:scale-105 transition-transform duration-300 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start hover:scale-105 transition-transform duration-300 bg-transparent"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh All
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
