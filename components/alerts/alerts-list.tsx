"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Info, ArrowRight, ArrowUpDown, CheckCircle, Bell } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { kpiData } from "@/types/kpi-types"

// Generate alerts based on our real KPIs
const generateAlerts = () => {
  const alerts = []

  // Add alerts for KPIs in warning or critical status
  kpiData.forEach((kpi) => {
    if (kpi.status === "warning" || kpi.status === "critical") {
      let description = ""
      const severity = kpi.status === "warning" ? "warning" : "critical"

      if (kpi.category === "continuous_operations") {
        if (kpi.id === "expiry-writeoffs") {
          description = `Expiry-related write-offs have increased to ${kpi.currentValue}% (target: ${kpi.targetValue}%)`
        } else if (kpi.id === "inventory-accuracy") {
          description = `Inventory accuracy is at ${kpi.currentValue}%, below target of ${kpi.targetValue}%`
        } else if (kpi.id === "stockout-rate") {
          description = `Stockout rate has increased to ${kpi.currentValue}% (target: ${kpi.targetValue}%)`
        } else if (kpi.id === "order-fill-rate") {
          description = `Order fill rate is at ${kpi.currentValue}%, below target of ${kpi.targetValue}%`
        } else if (kpi.id === "inventory-turnover") {
          description = `Inventory turnover is at ${kpi.currentValue} turns per year, below target of ${kpi.targetValue}`
        } else if (kpi.id === "days-of-supply") {
          description = `Days of supply is at ${kpi.currentValue} days, above target of ${kpi.targetValue} days`
        }
      } else if (kpi.category === "financial_optimization") {
        if (kpi.id === "inventory-carrying-cost") {
          description = `Inventory carrying cost is at ${kpi.currentValue}% of inventory value (target: ${kpi.targetValue}%)`
        } else if (kpi.id === "inventory-depreciation") {
          description = `Inventory depreciation is at ${kpi.currentValue}% of inventory value (target: ${kpi.targetValue}%)`
        } else if (kpi.id === "procurement-cost") {
          description = `Procurement cost is at ${kpi.currentValue}% of purchase value (target: ${kpi.targetValue}%)`
        } else if (kpi.id === "supplier-price-variance") {
          description = `Supplier price variance is at ${kpi.currentValue}% (target: ${kpi.targetValue}%)`
        } else if (kpi.id === "cash-to-cash-cycle") {
          description = `Cash-to-cash cycle time is at ${kpi.currentValue} days (target: ${kpi.targetValue} days)`
        } else if (kpi.id === "total-supply-chain-cost") {
          description = `Total supply chain cost is at ${kpi.currentValue}% of revenue (target: ${kpi.targetValue}%)`
        }
      }

      if (description) {
        alerts.push({
          id: alerts.length + 1,
          title: `${kpi.name} Alert`,
          description,
          kpi: kpi.name,
          severity,
          timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
          isRead: Math.random() > 0.5,
        })
      }
    }
  })

  // Add a few info alerts
  alerts.push({
    id: alerts.length + 1,
    title: "Inventory Turnover Improving",
    description: "Inventory turnover has improved by 5% over the last month",
    kpi: "Inventory Turnover",
    severity: "info",
    timestamp: "2 days ago",
    isRead: true,
  })

  alerts.push({
    id: alerts.length + 1,
    title: "New Supplier Added",
    description: "A new supplier has been added to the system",
    kpi: "Supplier Diversity",
    severity: "info",
    timestamp: "3 days ago",
    isRead: true,
  })

  // Sort by severity (critical first) and then by timestamp
  return alerts.sort((a, b) => {
    if (a.severity === "critical" && b.severity !== "critical") return -1
    if (a.severity !== "critical" && b.severity === "critical") return 1
    if (a.severity === "warning" && b.severity === "info") return -1
    if (a.severity === "info" && b.severity === "warning") return 1
    return 0
  })
}

const alertsData = generateAlerts()

export function AlertsList({ filter = "all" }: { filter?: "all" | "critical" | "warning" | "info" }) {
  const [sortField, setSortField] = useState<"severity" | "timestamp">("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [alerts, setAlerts] = useState(alertsData)

  // Filter alerts based on selected filter
  const filteredAlerts = filter === "all" ? alerts : alerts.filter((alert) => alert.severity === filter)

  // Sort alerts based on selected sort field and direction
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortField === "severity") {
      const severityOrder = { critical: 3, warning: 2, info: 1 }
      const aValue = severityOrder[a.severity as keyof typeof severityOrder]
      const bValue = severityOrder[b.severity as keyof typeof severityOrder]
      return sortDirection === "desc" ? bValue - aValue : aValue - bValue
    } else if (sortField === "timestamp") {
      // Simple string comparison for demo purposes
      // In a real app, you would parse the timestamps properly
      return sortDirection === "desc" ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp)
    }
    return 0
  })

  const handleSort = (field: "severity" | "timestamp") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const markAsRead = (id: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>KPI</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("severity")} className="flex items-center">
                  Severity
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("timestamp")} className="flex items-center">
                  Time
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAlerts.map((alert) => (
              <TableRow key={alert.id} className={!alert.isRead ? "bg-muted/20" : ""}>
                <TableCell>
                  <div className="flex items-start space-x-2">
                    {!alert.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
                    <div>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground">{alert.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{alert.kpi}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      alert.severity === "critical"
                        ? "destructive"
                        : alert.severity === "warning"
                          ? "default"
                          : "outline"
                    }
                  >
                    {alert.severity === "critical" ? (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    ) : alert.severity === "warning" ? (
                      <AlertTriangle className="mr-1 h-3 w-3" />
                    ) : (
                      <Info className="mr-1 h-3 w-3" />
                    )}
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell>{alert.timestamp}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {!alert.isRead && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Mark as Read
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedAlerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <div className="text-lg font-medium mb-2">No alerts found</div>
          <div className="text-muted-foreground mb-4">There are no alerts matching your current filter</div>
        </div>
      )}
    </div>
  )
}
