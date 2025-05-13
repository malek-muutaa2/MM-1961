"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, Plus } from "lucide-react"
import { getKPIById } from "@/types/kpi-types"

// Generate realistic actions for a specific KPI
const generateActionsForKPI = (kpiId: string) => {
  const kpi = getKPIById(kpiId)
  if (!kpi) return []

  const actions = []

  // Generate actions based on KPI type
  if (kpi.id === "expiry-writeoffs") {
    actions.push({
      id: 1,
      title: "Implement FEFO inventory management",
      description: "Implement First-Expired-First-Out (FEFO) inventory management for all perishable items",
      impact: {
        primary: {
          kpi: kpi.name,
          value: -45,
        },
        secondary: [
          {
            kpi: "Inventory Accuracy",
            value: 8,
          },
          {
            kpi: "Inventory Carrying Cost",
            value: -12,
          },
        ],
      },
      status: "in_progress",
      progress: 65,
      priority: "high",
      assignedTo: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      dueDate: "Apr 15, 2023",
    })

    actions.push({
      id: 2,
      title: "Implement expiry date tracking system",
      description: "Deploy a digital system to track expiry dates and generate alerts for items approaching expiration",
      impact: {
        primary: {
          kpi: kpi.name,
          value: -35,
        },
        secondary: [
          {
            kpi: "Inventory Accuracy",
            value: 12,
          },
        ],
      },
      status: "pending",
      progress: 0,
      priority: "high",
      assignedTo: null,
      dueDate: "May 20, 2023",
    })
  } else if (kpi.id === "inventory-accuracy") {
    actions.push({
      id: 1,
      title: "Implement cycle counting program",
      description: "Establish regular cycle counting procedures to improve inventory accuracy",
      impact: {
        primary: {
          kpi: kpi.name,
          value: 12,
        },
        secondary: [
          {
            kpi: "Stockout Rate",
            value: -15,
          },
        ],
      },
      status: "in_progress",
      progress: 30,
      priority: "high",
      assignedTo: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JS",
      },
      dueDate: "Apr 30, 2023",
    })
  } else if (kpi.id === "stockout-rate") {
    actions.push({
      id: 1,
      title: "Optimize reorder points",
      description: "Adjust reorder points based on lead time analysis and demand patterns",
      impact: {
        primary: {
          kpi: kpi.name,
          value: -35,
        },
        secondary: [
          {
            kpi: "Inventory Levels",
            value: 8,
          },
        ],
      },
      status: "completed",
      progress: 100,
      priority: "high",
      assignedTo: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      dueDate: "Mar 15, 2023",
    })
  } else if (kpi.id === "inventory-carrying-cost") {
    actions.push({
      id: 1,
      title: "Implement just-in-time inventory model",
      description: "Transition to a just-in-time inventory model for non-critical items",
      impact: {
        primary: {
          kpi: kpi.name,
          value: -25,
        },
        secondary: [
          {
            kpi: "Days of Supply",
            value: -30,
          },
          {
            kpi: "Stockout Rate",
            value: 5,
          },
        ],
      },
      status: "in_progress",
      progress: 45,
      priority: "medium",
      assignedTo: {
        name: "Sarah Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SL",
      },
      dueDate: "May 10, 2023",
    })
  } else {
    // Generic action for other KPIs
    actions.push({
      id: 1,
      title: `Optimize ${kpi.name}`,
      description: `Implement best practices to improve ${kpi.name}`,
      impact: {
        primary: {
          kpi: kpi.name,
          value: kpi.trend === "increasing" ? 15 : -15,
        },
        secondary: [
          {
            kpi: "Related KPI",
            value: 10,
          },
        ],
      },
      status: "pending",
      progress: 0,
      priority: "medium",
      assignedTo: null,
      dueDate: "Jun 1, 2023",
    })
  }

  return actions
}

export function KPIRelatedActions({ kpiId }: { kpiId: string }) {
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all")

  // Get actions for the KPI
  const actions = generateActionsForKPI(kpiId)

  // Filter actions based on selected filter
  const filteredActions = filter === "all" ? actions : actions.filter((action) => action.status === filter)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI-Generated Action Plans</CardTitle>
              <CardDescription>Recommended actions to optimize this KPI</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Actions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "in_progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("in_progress")}
            >
              In Progress
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>

          <div className="space-y-4">
            {filteredActions.map((action) => (
              <Card key={action.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        action.priority === "high"
                          ? "destructive"
                          : action.priority === "medium"
                            ? "default"
                            : "outline"
                      }
                    >
                      {action.priority} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Expected Impact</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center justify-between rounded-md border p-2">
                          <div>
                            <div className="text-sm font-medium">{action.impact.primary.kpi}</div>
                            <div className="text-xs text-muted-foreground">Primary KPI</div>
                          </div>
                          <div
                            className={`text-sm font-bold ${
                              action.impact.primary.value > 0 ? "text-green-500" : "text-blue-500"
                            }`}
                          >
                            {action.impact.primary.value > 0 ? "+" : ""}
                            {action.impact.primary.value}%
                          </div>
                        </div>
                        {action.impact.secondary.map((impact, index) => (
                          <div key={index} className="flex items-center justify-between rounded-md border p-2">
                            <div>
                              <div className="text-sm font-medium">{impact.kpi}</div>
                              <div className="text-xs text-muted-foreground">Secondary KPI</div>
                            </div>
                            <div
                              className={`text-sm font-bold ${impact.value > 0 ? "text-green-500" : "text-blue-500"}`}
                            >
                              {impact.value > 0 ? "+" : ""}
                              {impact.value}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Status</h4>
                        <Badge
                          variant={
                            action.status === "completed"
                              ? "default"
                              : action.status === "in_progress"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {action.status === "completed" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : action.status === "in_progress" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {action.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <Progress value={action.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {action.assignedTo ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={action.assignedTo.avatar} alt={action.assignedTo.name} />
                              <AvatarFallback>{action.assignedTo.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{action.assignedTo.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">Due: {action.dueDate}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredActions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-muted-foreground mb-2">No actions found</div>
                <Button variant="outline" size="sm">
                  Generate New Actions
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
