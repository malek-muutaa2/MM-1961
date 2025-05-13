"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertTriangle, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react"
import { kpiData } from "@/types/kpi-types"

// Generate insights based on our real KPIs
const generateInsights = () => {
  const insights = []

  // Add insights for specific KPIs
  kpiData.forEach((kpi) => {
    if (kpi.id === "expiry-writeoffs") {
      insights.push({
        id: insights.length + 1,
        title: "Expiry Write-Offs Optimization Opportunity",
        description:
          "Analysis shows that implementing a First-Expired-First-Out (FEFO) inventory management system could reduce expiry-related write-offs by up to 45%.",
        kpi: kpi.name,
        type: "recommendation",
        impact: "high",
        timestamp: "2 hours ago",
        confidence: 92,
      })
    } else if (kpi.id === "inventory-accuracy") {
      insights.push({
        id: insights.length + 1,
        title: "Inventory Accuracy Improvement Potential",
        description:
          "Implementing cycle counting procedures could improve inventory accuracy from current 94.2% to target 98% within 3 months.",
        kpi: kpi.name,
        type: "recommendation",
        impact: "high",
        timestamp: "1 day ago",
        confidence: 88,
      })
    } else if (kpi.id === "stockout-rate") {
      insights.push({
        id: insights.length + 1,
        title: "Unusual Stockout Pattern Detected",
        description:
          "An anomaly has been detected in stockout patterns for Category X products, with unexplained spikes occurring every 14 days.",
        kpi: kpi.name,
        type: "anomaly",
        impact: "medium",
        timestamp: "5 days ago",
        confidence: 76,
      })
    } else if (kpi.id === "inventory-turnover") {
      insights.push({
        id: insights.length + 1,
        title: "Seasonal Inventory Turnover Pattern",
        description:
          "AI has detected a recurring seasonal pattern in inventory turnover, with peaks in March and September.",
        kpi: kpi.name,
        type: "trend",
        impact: "medium",
        timestamp: "1 week ago",
        confidence: 85,
      })
    } else if (kpi.id === "inventory-carrying-cost") {
      insights.push({
        id: insights.length + 1,
        title: "Carrying Cost Reduction Opportunity",
        description:
          "Analysis of your inventory data suggests that implementing a just-in-time inventory model for non-critical items could reduce carrying costs by 25%.",
        kpi: kpi.name,
        type: "recommendation",
        impact: "high",
        timestamp: "3 days ago",
        confidence: 90,
      })
    }
  })

  // Add some general insights
  insights.push({
    id: insights.length + 1,
    title: "Supplier Consolidation Potential",
    description:
      "Analysis of your supplier data suggests consolidating orders from suppliers A, B, and C could reduce shipping costs by 12%.",
    kpi: "Shipping Costs",
    type: "recommendation",
    impact: "medium",
    timestamp: "4 days ago",
    confidence: 82,
  })

  insights.push({
    id: insights.length + 1,
    title: "Cash-to-Cash Cycle Correlation",
    description:
      "Strong correlation detected between days of supply and cash-to-cash cycle time, suggesting inventory optimization could improve cash flow.",
    kpi: "Cash-to-Cash Cycle Time",
    type: "trend",
    impact: "medium",
    timestamp: "2 weeks ago",
    confidence: 87,
  })

  return insights
}

const insightsData = generateInsights()

export function InsightsList({
  filter = "all",
}: { filter?: "all" | "recommendation" | "trend" | "anomaly" | "anomalies" }) {
  const [insights, setInsights] = useState(insightsData)

  // Filter insights based on selected filter
  const filteredInsights =
    filter === "all"
      ? insights
      : filter === "anomalies"
        ? insights.filter((insight) => insight.type === "anomaly")
        : insights.filter((insight) => insight.type === filter)

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-amber-500" />
      case "trend":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "anomaly":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Lightbulb className="h-5 w-5 text-amber-500" />
    }
  }

  return (
    <div className="space-y-4">
      {filteredInsights.map((insight) => (
        <Card key={insight.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                {getInsightIcon(insight.type)}
                <div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {insight.kpi} • {insight.timestamp}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  insight.impact === "high" ? "destructive" : insight.impact === "medium" ? "default" : "outline"
                }
              >
                {insight.impact} impact
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>AI Confidence: {insight.confidence}%</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              {insight.type === "recommendation" ? "Apply" : "View Details"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}

      {filteredInsights.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <div className="text-lg font-medium mb-2">No insights found</div>
          <div className="text-muted-foreground mb-4">There are no insights matching your current filter</div>
        </div>
      )}
    </div>
  )
}
