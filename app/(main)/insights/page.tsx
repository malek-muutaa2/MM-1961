import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InsightsList } from "@/components/insights/insights-list"
import { InsightsTrends } from "@/components/insights/insights-trends"
import { InsightsRecommendations } from "@/components/insights/insights-recommendations"

export const metadata: Metadata = {
  title: "AI Insights | MUUTAA.ML",
  description: "AI-generated insights and recommendations for KPI optimization",
}

export default function InsightsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Recent Insights</CardTitle>
                <CardDescription>AI-generated insights across all KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <InsightsList filter="all" />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Insight Trends</CardTitle>
                <CardDescription>Trends and patterns identified by AI</CardDescription>
              </CardHeader>
              <CardContent>
                <InsightsTrends />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>AI-generated recommendations for KPI optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <InsightsRecommendations />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI Trends</CardTitle>
              <CardDescription>AI-identified trends and patterns in your KPIs</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <InsightsTrends fullHeight />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Detailed recommendations for optimizing your KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <InsightsRecommendations detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>Unusual patterns and outliers detected by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <InsightsList filter="anomalies" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
