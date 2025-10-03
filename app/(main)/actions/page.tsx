import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActionsList } from "@/components/actions/actions-list"
import { ActionInsights } from "@/components/actions/action-insights"

export const metadata: Metadata = {
  title: "Action Plans | MUUTAA.ML",
  description: "AI-generated action plans for KPI optimization",
}

export default function ActionsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Action Plans</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Actions</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Action Plans</CardTitle>
                <CardDescription>AI-generated action plans for KPI optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <ActionsList filter="all" />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Action Insights</CardTitle>
                <CardDescription>Summary of action plan progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ActionInsights />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Actions that have not been started yet</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionsList filter="pending" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Actions</CardTitle>
              <CardDescription>Actions that are currently being implemented</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionsList filter="in_progress" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Actions</CardTitle>
              <CardDescription>Actions that have been successfully implemented</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionsList filter="completed" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
