"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// Mock data for timeline events
const timelineEvents = [
  {
    id: "1",
    title: "Manufacturing Plant Maintenance",
    date: "2023-05-15",
    type: "internal",
    impact: "high",
  },
  {
    id: "4",
    title: "New Wing Opening",
    date: "2023-07-15",
    type: "facility",
    impact: "high",
  },
  {
    id: "2",
    title: "Dr. Johnson Retirement",
    date: "2023-06-01",
    type: "facility",
    impact: "medium",
  },
  {
    id: "5",
    title: "Supply Chain Disruption",
    date: "2023-04-10",
    type: "internal",
    impact: "medium",
  },
  {
    id: "3",
    title: "Seasonal Flu Increase",
    date: "2023-12-01",
    type: "seasonal",
    impact: "high",
  },
]

// Sort events by date
const sortedEvents = [...timelineEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

export function EventsTimeline() {
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
        return "border-purple-500"
      case "facility":
        return "border-blue-500"
      case "seasonal":
        return "border-green-500"
      default:
        return "border-gray-500"
    }
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="relative pl-6 border-l border-border">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="mb-8 relative">
            <div
              className={`absolute -left-[21px] top-1 h-4 w-4 rounded-full border-4 bg-background ${getTypeColor(event.type)}`}
            ></div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{event.title}</h4>
                <Badge className={getImpactColor(event.impact)}>
                  {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)}
                </Badge>
              </div>
              <time className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</time>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
