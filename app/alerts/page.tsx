import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertsList } from "@/components/alerts/alerts-list"
import { AlertsInsights } from "@/components/alerts/alerts-insights"

export const metadata: Metadata = {
  title: "Alerts | MUUTAA.ML",
  description: "Monitor and manage KPI alerts",
}

export default function AlertsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="warning">Warning</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Alerts requiring attention across all KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList filter="all" />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Alert Summary</CardTitle>
                <CardDescription>Overview of alert status and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsInsights />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>High-priority alerts requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList filter="critical" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warning Alerts</CardTitle>
              <CardDescription>Alerts indicating potential issues</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList filter="warning" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Information Alerts</CardTitle>
              <CardDescription>Informational notifications about KPI changes</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsList filter="info" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
