import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataSourceList } from "@/components/settings/data-source-list"
import { DataSourceConnector } from "@/components/settings/data-source-connector"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Data Sources | MUUTAA.ML",
  description: "Configure and manage data sources for KPI analysis",
}

export default function DataSourcesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Source Configuration</h2>
          <p className="text-muted-foreground">Connect and manage your data sources for KPI analysis</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <span className="text-sm font-medium">7 KPIs</span>
          <span className="mx-1.5 text-muted-foreground">•</span>
          <span className="text-sm">5 Data Sources</span>
        </Badge>
      </div>

      <Tabs defaultValue="connected" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connected">Connected Sources</TabsTrigger>
          <TabsTrigger value="add-new">Add New Source</TabsTrigger>
          <TabsTrigger value="data-quality">Data Quality</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Data Sources</CardTitle>
              <CardDescription>Manage your existing data source connections</CardDescription>
            </CardHeader>
            <CardContent>
              <DataSourceList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Data Source</CardTitle>
              <CardDescription>Connect to a new data source to enhance your KPI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <DataSourceConnector />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Monitoring</CardTitle>
              <CardDescription>Monitor and improve the quality of your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Data quality monitoring features will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>Map fields from your data sources to KPI requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Field mapping features will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
