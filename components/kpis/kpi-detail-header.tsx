"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, BarChart3, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getKPIById } from "@/types/kpi-types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function KPIDetailHeader({ kpiId }: { kpiId: string }) {
  // Get KPI data based on the ID
  const kpi = getKPIById(kpiId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showActionPlanDialog, setShowActionPlanDialog] = useState(false)

  // If KPI not found, show default values
  const kpiData = kpi || {
    name: "Unknown KPI",
    description: "KPI details not found",
    category: "unknown",
    currentValue: 0,
    targetValue: 0,
    trend: "stable" as const,
    trendValue: 0,
    status: "on_target" as const,
    progress: 0,
    unit: "percentage",
  }

  // Calculate progress to target
  const calculateProgress = () => {
    if (kpiData.currentValue === kpiData.targetValue) return 100

    // For KPIs where lower is better (like costs, days of supply)
    if (
      kpiData.currentValue > kpiData.targetValue &&
      (kpiData.trend === "decreasing" ||
        kpiData.name.toLowerCase().includes("cost") ||
        kpiData.name.toLowerCase().includes("days") ||
        kpiData.name.toLowerCase().includes("write-off"))
    ) {
      // Calculate how far we are from the target (as a percentage)
      const maxValue = kpiData.currentValue * 1.5 // Assume 50% worse than current is the max
      const range = maxValue - kpiData.targetValue
      const distanceFromMax = maxValue - kpiData.currentValue
      return Math.round((distanceFromMax / range) * 100)
    }

    // For KPIs where higher is better (like accuracy, fill rate)
    if (
      kpiData.currentValue < kpiData.targetValue &&
      (kpiData.trend === "increasing" ||
        kpiData.name.toLowerCase().includes("accuracy") ||
        kpiData.name.toLowerCase().includes("fill"))
    ) {
      // Calculate progress as a percentage of the target
      return Math.round((kpiData.currentValue / kpiData.targetValue) * 100)
    }

    // Default case
    return 50
  }

  const progress = calculateProgress()

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{kpiData.name}</h2>
          <p className="text-muted-foreground">{kpiData.description}</p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit KPI</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit KPI</DialogTitle>
                <DialogDescription>
                  Make changes to the KPI settings here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" defaultValue={kpiData.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input id="description" defaultValue={kpiData.description} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target" className="text-right">
                    Target Value
                  </Label>
                  <Input
                    id="target"
                    type="number"
                    defaultValue={kpiData.targetValue.toString()}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setShowEditDialog(false)}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showActionPlanDialog} onOpenChange={setShowActionPlanDialog}>
            <DialogTrigger asChild>
              <Button>Generate Action Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Generate Action Plan</DialogTitle>
                <DialogDescription>
                  AI will analyze your KPI data and generate an action plan to help you reach your target.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Analyzing historical data...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Identifying improvement opportunities...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Generating recommendations...</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowActionPlanDialog(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Current Value</span>
              <div className="flex items-center">
                <span className="text-2xl font-bold">
                  {kpiData.currentValue}
                  {kpiData.unit === "percentage" ? "%" : kpiData.unit === "days" ? " days" : ""}
                </span>
                {kpiData.trend === "increasing" ? (
                  <ArrowUp className="ml-2 h-4 w-4 text-green-500" />
                ) : kpiData.trend === "decreasing" ? (
                  <ArrowDown className="ml-2 h-4 w-4 text-red-500" />
                ) : null}
                <span
                  className={`ml-1 text-sm ${
                    kpiData.trend === "increasing"
                      ? "text-green-500"
                      : kpiData.trend === "decreasing"
                        ? "text-red-500"
                        : ""
                  }`}
                >
                  {kpiData.trendValue}
                  {kpiData.unit === "percentage" ? "%" : ""}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Target Value</span>
              <span className="text-2xl font-bold">
                {kpiData.targetValue}
                {kpiData.unit === "percentage" ? "%" : kpiData.unit === "days" ? " days" : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Progress to Target</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <div className="flex items-center">
                {kpiData.status === "warning" ? (
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                ) : kpiData.status === "critical" ? (
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                ) : (
                  <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                )}
                <span
                  className={`text-lg font-medium ${
                    kpiData.status === "warning"
                      ? "text-amber-500"
                      : kpiData.status === "critical"
                        ? "text-red-500"
                        : "text-green-500"
                  }`}
                >
                  {kpiData.status === "warning"
                    ? "Needs Attention"
                    : kpiData.status === "critical"
                      ? "Critical"
                      : "On Target"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
