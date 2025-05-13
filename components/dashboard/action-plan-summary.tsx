import { CheckCircle2, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Generate realistic action plans based on our KPI data
const generateActionPlans = () => {
  const actionPlans = [
    {
      id: 1,
      title: "Implement FEFO for Perishable Items",
      description: "Implement First-Expired-First-Out (FEFO) inventory management for all perishable items",
      kpi: "Expiry-Related Write-Offs",
      impact: "-45%",
      status: "in_progress",
      progress: 65,
      assignedTo: "John Doe",
    },
    {
      id: 2,
      title: "Implement Cycle Counting Program",
      description: "Establish regular cycle counting procedures to improve inventory accuracy",
      kpi: "Inventory Accuracy",
      impact: "+12%",
      status: "pending",
      progress: 0,
      assignedTo: null,
    },
    {
      id: 3,
      title: "Optimize Reorder Points",
      description: "Adjust reorder points based on lead time analysis and demand patterns",
      kpi: "Stockout Rate",
      impact: "-35%",
      status: "completed",
      progress: 100,
      assignedTo: "Jane Smith",
    },
  ]

  return actionPlans
}

const actionPlans = generateActionPlans()

export function ActionPlanSummary() {
  return (
    <div className="space-y-4">
      {actionPlans.map((plan) => (
        <div key={plan.id} className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{plan.title}</h4>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <Badge
              variant={
                plan.status === "completed" ? "default" : plan.status === "in_progress" ? "outline" : "secondary"
              }
            >
              {plan.status === "completed" ? (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              ) : plan.status === "in_progress" ? (
                <Clock className="mr-1 h-3 w-3" />
              ) : null}
              {plan.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-muted-foreground">KPI:</span> {plan.kpi}
              </div>
              <div>
                <span className="text-muted-foreground">Impact:</span> {plan.impact}
              </div>
            </div>
            {plan.assignedTo && <div className="text-muted-foreground">Assigned to: {plan.assignedTo}</div>}
          </div>
          <Progress value={plan.progress} className="h-2" />
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-xs">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
