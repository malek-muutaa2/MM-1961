"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for calendar events
const calendarEvents = [
  {
    id: "1",
    title: "Manufacturing Plant Maintenance",
    date: new Date(2023, 4, 15),
    type: "internal",
    impact: "high",
  },
  {
    id: "2",
    title: "Dr. Johnson Retirement",
    date: new Date(2023, 5, 1),
    type: "facility",
    impact: "medium",
  },
  {
    id: "3",
    title: "Seasonal Flu Increase",
    date: new Date(2023, 11, 1),
    type: "seasonal",
    impact: "high",
  },
  {
    id: "4",
    title: "New Wing Opening",
    date: new Date(2023, 6, 15),
    type: "facility",
    impact: "high",
  },
  {
    id: "5",
    title: "Supply Chain Disruption",
    date: new Date(2023, 3, 10),
    type: "internal",
    impact: "medium",
  },
]

export function EventsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState<any[]>([])

  // Function to check if a date has events
  const hasEvents = (day: Date) => {
    return calendarEvents.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  // Function to get events for a specific day
  const getEventsForDay = (day: Date) => {
    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  // Handle day selection
  const handleSelect = (day: Date | undefined) => {
    setDate(day)
    if (day) {
      setSelectedDayEvents(getEventsForDay(day))
    } else {
      setSelectedDayEvents([])
    }
  }

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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
          modifiers={{
            hasEvent: (date) => hasEvents(date),
          }}
          modifiersStyles={{
            hasEvent: {
              fontWeight: "bold",
              backgroundColor: "var(--primary-50)",
              color: "var(--primary-900)",
              borderRadius: "0.25rem",
            },
          }}
        />
      </div>
      <div className="md:w-1/2">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Events for {date?.toLocaleDateString()}</h3>
            {selectedDayEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events for this day</p>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex space-x-2">
                          <Badge className={getTypeColor(event.type)}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <Badge className={getImpactColor(event.impact)}>
                            {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
