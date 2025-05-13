"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, ArrowRight, CheckCircle2, Clock } from "lucide-react"

// Sample recommendations data
const recommendationsData = [
  {
    id: 1,
    title: "Reduce safety stock for high-turnover items",
    description:
      "Analysis shows that reducing safety stock for high-turnover items by 15% would free up capital with minimal impact on stockout risk.",
    kpi: "Inventory Levels",
    impact: {
      primary: {
        kpi: "Inventory Levels",
        value: -15,
      },
      secondary: [
        {
          kpi: "Capital Tied Up",
          value: -12,
        },
        {
          kpi: "Stockout Risk",
          value: 2,
        },
      ],
    },
    difficulty: "medium",
    timeframe: "1-2 weeks",
    status: "pending",
    confidence: 92,
    details:
      "Our AI analysis of your inventory turnover rates and historical stockout data indicates that your current safety stock levels for high-turnover items (those with turnover rates >5x per month) are higher than necessary. By reducing safety stock for these specific items by 15%, you could free up significant capital while only marginally increasing stockout risk. The analysis shows that these items have had consistent supply patterns over the past 12 months, making them good candidates for safety stock optimization.",
  },
  {
    id: 2,
    title: "Consolidate orders from multiple suppliers",
    description:
      "Analysis of your supplier data suggests consolidating orders from suppliers A, B, and C could reduce shipping costs by 12%.",
    kpi: "Shipping Costs",
    impact: {
      primary: {
        kpi: "Shipping Costs",
        value: -12,
      },
      secondary: [
        {
          kpi: "Order Processing Time",
          value: -8,
        },
        {
          kpi: "Inventory Levels",
          value: 5,
        },
      ],
    },
    difficulty: "medium",
    timeframe: "2-4 weeks",
    status: "in_progress",
    progress: 35,
    confidence: 85,
    details:
      "Your current ordering pattern shows frequent small orders from suppliers A, B, and C, who are all located in the same geographic region. By consolidating these orders into larger, less frequent shipments, you could significantly reduce shipping costs through volume discounts and reduced handling. Our analysis suggests a potential 12% reduction in shipping costs, with the added benefit of reducing order processing time. Note that this may require slightly higher inventory levels to accommodate the less frequent delivery schedule.",
  },
  {
    id: 3,
    title: "Implement FIFO system for perishable items",
    description:
      "Implementing a First-In-First-Out (FIFO) system for perishable items could reduce waste by up to 25%.",
    kpi: "Waste Reduction",
    impact: {
      primary: {
        kpi: "Waste Reduction",
        value: -25,
      },
      secondary: [
        {
          kpi: "Inventory Accuracy",
          value: 15,
        },
        {
          kpi: "Capital Tied Up",
          value: -8,
        },
      ],
    },
    difficulty: "high",
    timeframe: "1-3 months",
    status: "completed",
    confidence: 94,
    details:
      "Analysis of your waste data shows that a significant portion of perishable item waste is due to improper rotation of stock. Implementing a strict FIFO system would ensure older stock is used first, reducing the amount of expired product. This would require changes to your warehouse layout and staff training, but could reduce waste by up to 25%. The system would also improve inventory accuracy by providing better visibility into stock age and location.",
  },
  {
    id: 4,
    title: "Optimize reorder points based on lead time analysis",
    description:
      "Adjusting reorder points using historical lead time data and demand patterns could reduce stockouts by 18%.",
    kpi: "Stockout Risk",
    impact: {
      primary: {
        kpi: "Stockout Risk",
        value: -18,
      },
      secondary: [
        {
          kpi: "Inventory Levels",
          value: 7,
        },
        {
          kpi: "Customer Satisfaction",
          value: 10,
        },
      ],
    },
    difficulty: "medium",
    timeframe: "2-3 weeks",
    status: "pending",
    confidence: 88,
    details:
      "Our AI has analyzed your historical lead times and identified significant variability that isn't being accounted for in your current reorder point calculations. By adjusting reorder points to account for this variability, particularly for critical items, you could reduce stockouts by approximately 18%. This would require a slight increase in inventory levels for affected items, but the improved availability would also positively impact customer satisfaction metrics.",
  },
]

export function InsightsRecommendations({ detailed = false }: { detailed?: boolean }) {
  const [activeTab, setActiveTab] = useState<string>("all")

  const filteredRecommendations =
    activeTab === "all" ? recommendationsData : recommendationsData.filter((rec) => rec.status === activeTab)

  return (
    <div className="space-y-4">
      {!detailed && (
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <Card key={recommendation.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="mt-1 h-5 w-5 text-amber-500" />
                  <div>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {recommendation.kpi} • Confidence: {recommendation.confidence}%
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    recommendation.status === "completed"
                      ? "default"
                      : recommendation.status === "in_progress"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {recommendation.status === "completed" ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : recommendation.status === "in_progress" ? (
                    <Clock className="mr-1 h-3 w-3" />
                  ) : null}
                  {recommendation.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>

              {detailed && (
                <div className="text-sm text-muted-foreground mt-2 space-y-4">
                  <div className="rounded-md border p-3">
                    <h4 className="font-medium mb-2">Detailed Analysis</h4>
                    <p>{recommendation.details}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Expected Impact</h4>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <div className="text-sm font-medium">{recommendation.impact.primary.kpi}</div>
                      <div className="text-xs text-muted-foreground">Primary KPI</div>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        recommendation.impact.primary.value > 0 ? "text-green-500" : "text-blue-500"
                      }`}
                    >
                      {recommendation.impact.primary.value > 0 ? "+" : ""}
                      {recommendation.impact.primary.value}%
                    </div>
                  </div>
                  {recommendation.impact.secondary.map((impact, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-2">
                      <div>
                        <div className="text-sm font-medium">{impact.kpi}</div>
                        <div className="text-xs text-muted-foreground">Secondary KPI</div>
                      </div>
                      <div className={`text-sm font-bold ${impact.value > 0 ? "text-green-500" : "text-blue-500"}`}>
                        {impact.value > 0 ? "+" : ""}
                        {impact.value}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Difficulty</div>
                  <div className="text-sm text-muted-foreground capitalize">{recommendation.difficulty}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Timeframe</div>
                  <div className="text-sm text-muted-foreground">{recommendation.timeframe}</div>
                </div>
              </div>

              {recommendation.status === "in_progress" && recommendation.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Progress</div>
                    <div className="text-sm font-medium">{recommendation.progress}%</div>
                  </div>
                  <Progress value={recommendation.progress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                {recommendation.status === "completed"
                  ? "View Results"
                  : recommendation.status === "in_progress"
                    ? "Update Progress"
                    : "Implement Recommendation"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
