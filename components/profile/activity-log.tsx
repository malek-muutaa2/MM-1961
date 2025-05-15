"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Filter, Download } from "lucide-react"

type ActivityType = {
  id: string
  action: string
  description: string
  timestamp: string
  ip: string
  location: string
  type: "login" | "data" | "settings" | "export" | "api"
}

export function ActivityLog() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [activityType, setActivityType] = useState<string>("all")

  // Sample activity data
  const activities: ActivityType[] = [
    {
      id: "act-1",
      action: "Login",
      description: "Successful login from Chrome on Windows",
      timestamp: "Today at 10:23 AM",
      ip: "192.168.1.1",
      location: "New York, USA",
      type: "login",
    },
    {
      id: "act-2",
      action: "Profile Update",
      description: "Updated personal information",
      timestamp: "Today at 9:45 AM",
      ip: "192.168.1.1",
      location: "New York, USA",
      type: "settings",
    },
    {
      id: "act-3",
      action: "Data Export",
      description: "Exported KPI data as CSV",
      timestamp: "Yesterday at 3:12 PM",
      ip: "192.168.1.1",
      location: "New York, USA",
      type: "export",
    },
    {
      id: "act-4",
      action: "API Access",
      description: "API key used to access KPI data",
      timestamp: "Yesterday at 1:30 PM",
      ip: "192.168.1.2",
      location: "New York, USA",
      type: "api",
    },
    {
      id: "act-5",
      action: "Settings Change",
      description: "Changed notification preferences",
      timestamp: "May 10, 2023 at 11:15 AM",
      ip: "192.168.1.1",
      location: "New York, USA",
      type: "settings",
    },
    {
      id: "act-6",
      action: "Login",
      description: "Successful login from Mobile App on iOS",
      timestamp: "May 9, 2023 at 8:30 AM",
      ip: "192.168.0.5",
      location: "Boston, USA",
      type: "login",
    },
    {
      id: "act-7",
      action: "Data Update",
      description: "Updated KPI thresholds for Inventory Turnover",
      timestamp: "May 8, 2023 at 2:45 PM",
      ip: "192.168.1.1",
      location: "New York, USA",
      type: "data",
    },
  ]

  // Filter activities based on selected filters
  const filteredActivities = activities.filter((activity) => {
    if (activityType !== "all" && activity.type !== activityType) {
      return false
    }
    // Date filtering would go here if implemented
    return true
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>View your recent account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal sm:w-[240px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="data">Data Changes</SelectItem>
                  <SelectItem value="settings">Settings Changes</SelectItem>
                  <SelectItem value="export">Exports</SelectItem>
                  <SelectItem value="api">API Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export Log
            </Button>
          </div>

          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex flex-col space-y-1 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{activity.action}</span>
                  <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>IP: {activity.ip}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.location}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
