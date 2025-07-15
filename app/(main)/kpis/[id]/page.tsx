import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KPIDetailHeader } from "@/components/kpis/kpi-detail-header"
import { KPIHistoricalChart } from "@/components/kpis/kpi-historical-chart"
import { KPIForecastChart } from "@/components/kpis/kpi-forecast-chart"
import { KPIRelatedActions } from "@/components/kpis/kpi-related-actions"
import { KPISettings } from "@/components/kpis/kpi-settings"
import { getKPIById } from "@/types/kpi-types"

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  const kpi = getKPIById(params.id)
  return {
    title: kpi ? `${kpi.name} | MUUTAA.ML` : "KPI Details | MUUTAA.ML",
    description: kpi ? kpi.description : "Detailed analysis and management of a specific KPI",
  }
}

export default function KPIDetailPage({
  params,
}: Readonly<{
  params: { id: string };
}>) {
  const kpiId = params.id
  const kpi = getKPIById(kpiId)

  if (!kpi) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">KPI Not Found</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>The requested KPI could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check the KPI ID and try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <KPIDetailHeader kpiId={kpiId} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance</CardTitle>
              <CardDescription>Track how this KPI has performed over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <KPIHistoricalChart kpiId={kpiId} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Related KPIs</CardTitle>
                <CardDescription>KPIs that have dependencies with this one</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpi.category === "continuous_operations" ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Inventory Accuracy</div>
                          <div className="text-sm text-muted-foreground">
                            {kpi.id === "expiry-writeoffs" ? "Negative correlation" : "Positive correlation"}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{kpi.id === "expiry-writeoffs" ? "-0.75" : "+0.82"}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Stockout Rate</div>
                          <div className="text-sm text-muted-foreground">
                            {kpi.id === "inventory-accuracy" ? "Negative correlation" : "Positive correlation"}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{kpi.id === "inventory-accuracy" ? "-0.85" : "+0.68"}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Inventory Carrying Cost</div>
                          <div className="text-sm text-muted-foreground">
                            {kpi.id === "inventory-depreciation" ? "Positive correlation" : "Negative correlation"}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {kpi.id === "inventory-depreciation" ? "+0.82" : "-0.80"}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Cash-to-Cash Cycle Time</div>
                          <div className="text-sm text-muted-foreground">
                            {kpi.id === "total-supply-chain-cost" ? "Positive correlation" : "Negative correlation"}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {kpi.id === "total-supply-chain-cost" ? "+0.72" : "-0.65"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Systems providing data for this KPI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">ERP System</div>
                      <div className="text-sm text-muted-foreground">Last synced: 2 hours ago</div>
                    </div>
                    <div className="text-sm font-medium text-green-500">Connected</div>
                  </div>
                  {kpi.category === "continuous_operations" ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Inventory Management</div>
                        <div className="text-sm text-muted-foreground">Last synced: 1 day ago</div>
                      </div>
                      <div className="text-sm font-medium text-green-500">Connected</div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Financial System</div>
                        <div className="text-sm text-muted-foreground">Last synced: 4 hours ago</div>
                      </div>
                      <div className="text-sm font-medium text-green-500">Connected</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI Forecast</CardTitle>
              <CardDescription>AI-generated forecast for the next 90 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <KPIForecastChart kpiId={kpiId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forecast Analysis</CardTitle>
              <CardDescription>AI insights based on the forecast data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Trend Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {kpi.trend === "increasing"
                      ? `The KPI is projected to improve by ${kpi.trendValue * 3}% over the next 90 days based on current actions and historical patterns.`
                      : `The KPI is projected to decrease by ${kpi.trendValue * 3}% over the next 90 days based on current actions and historical patterns.`}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Seasonal Factors</h4>
                  <p className="text-sm text-muted-foreground">
                    A temporary {kpi.trend === "increasing" ? "decline" : "increase"} is expected in weeks 6-8 due to
                    seasonal factors, but the overall trend remains{" "}
                    {kpi.trend === "increasing" ? "positive" : "negative"}.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Confidence Level</h4>
                  <p className="text-sm text-muted-foreground">
                    The forecast has a confidence level of {kpi.confidenceScore}% based on data quality and historical
                    accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <KPIRelatedActions kpiId={kpiId} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <KPISettings kpiId={kpiId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
