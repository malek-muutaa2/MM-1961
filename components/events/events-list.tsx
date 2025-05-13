"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle, Plus, ChevronRight } from "lucide-react"
import { AddEventModal } from "./add-event-modal"
import { EventDetailsModal } from "./event-details-modal"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Manufacturing Plant Maintenance",
    date: "2023-05-15",
    type: "internal",
    category: "shortage",
    impact: "high",
    description: "Scheduled maintenance at Plant B affecting production capacity by 30%",
    source: "manual",
    products: ["Product A", "Product B"],
    duration: { start: "2023-05-15", end: "2023-05-20" },
  },
  {
    id: "2",
    title: "Dr. Johnson Retirement",
    date: "2023-06-01",
    type: "facility",
    category: "personnel",
    impact: "medium",
    description: "Lead surgeon retirement at Memorial Hospital",
    source: "manual",
    products: ["Product C"],
    duration: { start: "2023-06-01", end: null },
  },
  {
    id: "3",
    title: "Seasonal Flu Increase",
    date: "2023-12-01",
    type: "seasonal",
    category: "demand",
    impact: "high",
    description: "Annual flu season expected to increase demand",
    source: "auto-detected",
    products: ["Product A", "Product D", "Product E"],
    duration: { start: "2023-12-01", end: "2024-02-28" },
  },
  {
    id: "4",
    title: "New Wing Opening",
    date: "2023-07-15",
    type: "facility",
    category: "expansion",
    impact: "high",
    description: "New surgical wing opening at City Hospital",
    source: "manual",
    products: ["Product B", "Product C", "Product F"],
    duration: { start: "2023-07-15", end: null },
  },
  {
    id: "5",
    title: "Supply Chain Disruption",
    date: "2023-04-10",
    type: "internal",
    category: "logistics",
    impact: "medium",
    description: "Shipping delays affecting raw material delivery",
    source: "auto-detected",
    products: ["Product A", "Product B"],
    duration: { start: "2023-04-10", end: "2023-04-25" },
  },
]

type EventsListProps = {
  filter: "all" | "auto-detected" | "manual" | "internal" | "facility" | "seasonal"
}

export function EventsList({ filter }: EventsListProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Filter events based on the filter prop
  const filteredEvents = mockEvents.filter((event) => {
    if (filter === "all") return true
    if (filter === "auto-detected") return event.source === "auto-detected"
    if (filter === "manual") return event.source === "manual"
    return event.type === filter
  })

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Showing {filteredEvents.length} events</div>
        {filter !== "auto-detected" && (
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {new Date(event.date).toLocaleDateString()}
                      {event.duration.end && ` - ${new Date(event.duration.end).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getTypeColor(event.type)}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
                  <Badge className={getImpactColor(event.impact)}>
                    {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
                  </Badge>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">{event.description}</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Affects {event.products.length} products</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AddEventModal open={showAddModal} onOpenChange={setShowAddModal} />

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
