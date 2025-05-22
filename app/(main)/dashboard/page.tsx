import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KPIOverview } from "@/components/dashboard/kpi-overview"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { ActionPlanSummary } from "@/components/dashboard/action-plan-summary"
import { KPITrends } from "@/components/dashboard/kpi-trends"
import { DependencyGraph } from "@/components/dashboard/dependency-graph"
import { kpiData } from "@/types/kpi-types"

export const metadata: Metadata = {
  title: "Dashboard | MUUTAA.ML",
  description: "KPI Dashboard for Supply Chain Optimization",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="continuous-ops">Continuous Ops</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total KPIs</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 since last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KPIs On Target</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">67% of total KPIs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">-2 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">+3 since yesterday</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>KPI Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <KPIOverview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>3 active alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAlerts />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Action Plan Summary</CardTitle>
                <CardDescription>AI-generated action plans for KPI optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <ActionPlanSummary />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>KPI Trends</CardTitle>
                <CardDescription>Performance trends over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <KPITrends />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>KPI Dependency Graph</CardTitle>
              <CardDescription>Visualize relationships between KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyGraph />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="continuous-ops" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData
              .filter((kpi) => kpi.category === "continuous_operations")
              .map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                    <div
                      className={`h-4 w-4 rounded-full ${
                        kpi.status === "on_target"
                          ? "bg-green-500"
                          : kpi.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpi.currentValue}
                      {kpi.unit === "percentage" ? "%" : kpi.unit === "days" ? " days" : ""}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target: {kpi.targetValue}
                      {kpi.unit === "percentage" ? "%" : kpi.unit === "days" ? " days" : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Continuous Operations KPIs</CardTitle>
              <CardDescription>Performance trends over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <KPITrends />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData
              .filter((kpi) => kpi.category === "financial_optimization")
              .map((kpi) => (
                <Card key={kpi.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                    <div
                      className={`h-4 w-4 rounded-full ${
                        kpi.status === "on_target"
                          ? "bg-green-500"
                          : kpi.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpi.currentValue}
                      {kpi.unit === "percentage" ? "%" : kpi.unit === "days" ? " days" : ""}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target: {kpi.targetValue}
                      {kpi.unit === "percentage" ? "%" : kpi.unit === "days" ? " days" : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Financial Optimization KPIs</CardTitle>
              <CardDescription>Performance trends over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <KPITrends />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
