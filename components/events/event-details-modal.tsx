"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Tag, BarChart, Building, Package } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type EventDetailsModalProps = {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDetailsModal({ event, open, onOpenChange }: EventDetailsModalProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "internal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "facility":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "seasonal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle>{event.title}</DialogTitle>
            <div className="flex space-x-2">
              <Badge className={getTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              <Badge className={getImpactColor(event.impact)}>
                {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
              </Badge>
            </div>
          </div>
          <DialogDescription>Event details and forecasting impact</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                {new Date(event.date).toLocaleDateString()}
                {event.duration.end && ` - ${new Date(event.duration.end).toLocaleDateString()}`}
              </span>
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm capitalize">{event.category}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Affected Products</h4>
            <div className="flex flex-wrap gap-2">
              {event.products.map((product: string, index: number) => (
                <div key={index} className="flex items-center px-3 py-1 bg-secondary rounded-full text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  {product}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2">Forecasting Impact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-md">
                <div className="flex items-center mb-1">
                  <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Demand Change</span>
                </div>
                <span
                  className={`text-lg font-bold ${event.impact === "high" ? "text-red-600" : event.impact === "medium" ? "text-yellow-600" : "text-green-600"}`}
                >
                  {event.impact === "high" ? "-25%" : event.impact === "medium" ? "-15%" : "-5%"}
                </span>
              </div>
              <div className="p-3 border rounded-md">
                <div className="flex items-center mb-1">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Facilities Affected</span>
                </div>
                <span className="text-lg font-bold">
                  {event.type === "facility" ? "1" : event.impact === "high" ? "3+" : "2"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="default">Edit Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
