import { AlertTriangle, AlertCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { kpiData } from "@/types/kpi-types"

// Generate realistic alerts based on our KPI data
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
          severity,
          timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
          kpi: kpi.name,
        })
      }
    }
  })

  // Sort by severity (critical first) and then by timestamp
  return alerts
    .sort((a, b) => {
      if (a.severity === "critical" && b.severity !== "critical") return -1
      if (a.severity !== "critical" && b.severity === "critical") return 1
      return 0
    })
    .slice(0, 3) // Only show top 3 alerts
}

const alerts = generateAlerts()

export function RecentAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-start space-x-4 rounded-md border p-4">
          <div className="mt-0.5">
            {alert.severity === "critical" ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : alert.severity === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <Info className="h-5 w-5 text-blue-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{alert.title}</p>
              <Badge variant={alert.severity === "critical" ? "destructive" : "outline"}>{alert.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{alert.kpi}</span>
                <span className="mx-2">•</span>
                <span>{alert.timestamp}</span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
