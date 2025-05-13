import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BarChart3, AlertTriangle } from "lucide-react"
import { getKPIsByCategory } from "@/types/kpi-types"

export const metadata: Metadata = {
  title: "Financial Optimization KPIs | MUUTAA.ML",
  description: "Monitor and manage financial optimization KPIs",
}

export default function FinancialOptimizationPage() {
  const kpis = getKPIsByCategory("financial_optimization")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financial Optimization KPIs</h2>
        <Button>
          <Link href="/kpis/selection">Add KPI</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="overflow-hidden flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle>{kpi.name}</CardTitle>
                <Badge
                  variant={
                    kpi.status === "on_target" ? "default" : kpi.status === "warning" ? "outline" : "destructive"
                  }
                >
                  {kpi.status === "on_target" ? "On Target" : kpi.status === "warning" ? "Warning" : "Critical"}
                </Badge>
              </div>
              <CardDescription>{kpi.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {kpi.status === "on_target" ? (
                      <BarChart3 className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium">
                      Current: {kpi.currentValue}
                      {kpi.unit === "percentage" ? "%" : kpi.unit === "days" ? " days" : ""}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    Target: {kpi.targetValue}
                    {kpi.unit === "percentage" ? "%" : kpi.unit === "days" ? " days" : ""}
                  </span>
                </div>
                <Progress
                  value={
                    kpi.currentValue >= kpi.targetValue && kpi.trend === "increasing"
                      ? 100
                      : kpi.currentValue <= kpi.targetValue && kpi.trend === "decreasing"
                        ? 100
                        : kpi.trend === "increasing"
                          ? (kpi.currentValue / kpi.targetValue) * 100
                          : 100 - ((kpi.currentValue - kpi.targetValue) / kpi.targetValue) * 100
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-3 mt-auto">
              <Link href={`/kpis/${kpi.id}`} className="w-full">
                <Button variant="ghost" className="w-full justify-between">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
