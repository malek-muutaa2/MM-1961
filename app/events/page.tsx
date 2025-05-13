import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventsList } from "@/components/events/events-list"
import { EventsTimeline } from "@/components/events/events-timeline"
import { EventsImpact } from "@/components/events/events-impact"

export const metadata: Metadata = {
  title: "Event Manager | MUUTAA.ML",
  description: "Manage events that influence forecasting and KPI performance",
}

export default function EventsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Event Manager</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="auto-detected">Auto-Detected</TabsTrigger>
          <TabsTrigger value="manual">Manual Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>All events that may impact forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <EventsList filter="all" />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>Chronological view of upcoming and past events</CardDescription>
              </CardHeader>
              <CardContent>
                <EventsTimeline />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forecasting Impact</CardTitle>
              <CardDescription>How events affect your forecasting models</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsImpact />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-detected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Detected Events</CardTitle>
              <CardDescription>Events automatically identified by the system</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList filter="auto-detected" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Events</CardTitle>
              <CardDescription>User-defined events that may impact forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList filter="manual" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
