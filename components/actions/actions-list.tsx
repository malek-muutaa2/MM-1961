"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Generate actions based on our real KPIs
const generateActions = () => {
  const actions = [
    {
      id: 1,
      title: "Implement FEFO for Perishable Items",
      kpi: "Expiry-Related Write-Offs",
      impact: -45,
      status: "in_progress",
      progress: 65,
      priority: "high",
      assignedTo: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      dueDate: "Apr 15, 2023",
    },
    {
      id: 2,
      title: "Implement Cycle Counting Program",
      kpi: "Inventory Accuracy",
      impact: 12,
      status: "pending",
      progress: 0,
      priority: "high",
      assignedTo: null,
      dueDate: "May 20, 2023",
    },
    {
      id: 3,
      title: "Optimize Reorder Points",
      kpi: "Stockout Rate",
      impact: -35,
      status: "completed",
      progress: 100,
      priority: "high",
      assignedTo: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JS",
      },
      dueDate: "Mar 15, 2023",
    },
    {
      id: 4,
      title: "Implement Just-in-Time Inventory Model",
      kpi: "Inventory Carrying Cost",
      impact: -25,
      status: "in_progress",
      progress: 45,
      priority: "medium",
      assignedTo: {
        name: "Sarah Lee",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SL",
      },
      dueDate: "May 10, 2023",
    },
    {
      id: 5,
      title: "Consolidate Supplier Orders",
      kpi: "Shipping Costs",
      impact: -12,
      status: "pending",
      progress: 0,
      priority: "medium",
      assignedTo: null,
      dueDate: "Jun 5, 2023",
    },
    {
      id: 6,
      title: "Implement Automated Inventory Tracking",
      kpi: "Inventory Turnover",
      impact: 20,
      status: "completed",
      progress: 100,
      priority: "medium",
      assignedTo: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      dueDate: "Feb 28, 2023",
    },
    {
      id: 7,
      title: "Optimize Cash-to-Cash Cycle",
      kpi: "Cash-to-Cash Cycle Time",
      impact: -18,
      status: "in_progress",
      progress: 25,
      priority: "high",
      assignedTo: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      dueDate: "May 30, 2023",
    },
  ]

  return actions
}

const actionsData = generateActions()

export function ActionsList({ filter = "all" }: { filter?: "all" | "pending" | "in_progress" | "completed" }) {
  const [sortField, setSortField] = useState<"priority" | "dueDate" | "impact">("priority")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter actions based on selected filter
  const filteredActions = filter === "all" ? actionsData : actionsData.filter((action) => action.status === filter)

  // Sort actions based on selected sort field and direction
  const sortedActions = [...filteredActions].sort((a, b) => {
    if (sortField === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aValue = priorityOrder[a.priority as keyof typeof priorityOrder]
      const bValue = priorityOrder[b.priority as keyof typeof priorityOrder]
      return sortDirection === "desc" ? bValue - aValue : aValue - bValue
    } else if (sortField === "dueDate") {
      const aDate = new Date(a.dueDate)
      const bDate = new Date(b.dueDate)
      return sortDirection === "desc" ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime()
    } else if (sortField === "impact") {
      // For impact, we want to sort by absolute value but preserve the sign
      const aAbs = Math.abs(a.impact)
      const bAbs = Math.abs(b.impact)
      return sortDirection === "desc" ? bAbs - aAbs : aAbs - bAbs
    }
    return 0
  })

  const handleSort = (field: "priority" | "dueDate" | "impact") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>KPI</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("impact")} className="flex items-center">
                  Impact
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("priority")} className="flex items-center">
                  Priority
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("dueDate")} className="flex items-center">
                  Due Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedActions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">{action.title}</TableCell>
                <TableCell>{action.kpi}</TableCell>
                <TableCell className={action.impact > 0 ? "text-green-500 font-medium" : "text-blue-500 font-medium"}>
                  {action.impact > 0 ? `+${action.impact}%` : `${action.impact}%`}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      action.priority === "high" ? "destructive" : action.priority === "medium" ? "default" : "outline"
                    }
                  >
                    {action.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <Badge
                      variant={
                        action.status === "completed"
                          ? "default"
                          : action.status === "in_progress"
                            ? "outline"
                            : "secondary"
                      }
                      className="w-fit"
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
                    {action.status === "in_progress" && <Progress value={action.progress} className="h-1 w-20" />}
                  </div>
                </TableCell>
                <TableCell>
                  {action.assignedTo ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={action.assignedTo.avatar} alt={action.assignedTo.name} />
                        <AvatarFallback>{action.assignedTo.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{action.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{action.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedActions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-muted-foreground mb-2">No actions found</div>
          <Button variant="outline" size="sm">
            Generate New Actions
          </Button>
        </div>
      )}
    </div>
  )
}
