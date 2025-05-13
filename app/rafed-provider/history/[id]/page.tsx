import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { ForecastProductTimeline } from "@/components/rafed-provider/forecast-product-timeline"
import { ForecastDataTable } from "@/components/rafed-provider/forecast-data-table"
import { ForecastAnomalies } from "@/components/rafed-provider/forecast-anomalies"

export default function ForecastDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the forecast details using the ID
  const forecastId = params.id

  // Mock data for the example
  const forecastData = {
    id: forecastId,
    fileName: "forecast-may-2025.xlsx",
    uploadDate: "2025-04-15T10:30:00Z",
    forecastPeriod: "May 2025",
    status: "submitted" as const,
    productCount: 156,
    totalQuantity: 28750,
    fileSize: "2.4 MB",
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-2 -ml-2 flex items-center gap-1 text-muted-foreground">
          <Link href="/rafed-provider/history">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">{forecastData.fileName}</h1>
            <p className="text-muted-foreground">
              Forecast for {forecastData.forecastPeriod} • Uploaded on{" "}
              {new Date(forecastData.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Forecast Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecastData.forecastPeriod}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecastData.productCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="mt-6">
        <TabsList>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="file">File Information</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Forecast Timeline</CardTitle>
              <CardDescription>
                Historical, provider forecast, and Rafed adjusted forecast quantities for selected product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastProductTimeline forecastId={forecastId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Data</CardTitle>
              <CardDescription>Detailed view of all products in your forecast with Rafed adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastDataTable forecastId={forecastId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Anomalies</CardTitle>
              <CardDescription>Potential issues detected in your forecast data that may require review</CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastAnomalies forecastId={forecastId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>File Information</CardTitle>
              <CardDescription>Details about the uploaded forecast file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{forecastData.fileName}</h3>
                    <p className="text-sm text-muted-foreground">Excel Spreadsheet • {forecastData.fileSize}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Upload Date</div>
                    <div>{new Date(forecastData.uploadDate).toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Status</div>
                    <div className="text-green-600">Submitted</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Validation Date</div>
                    <div>{new Date(forecastData.uploadDate).toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">File Size</div>
                    <div>{forecastData.fileSize}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Rows</div>
                    <div>157 (including header)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
