import { Suspense } from "react"
import { AlertsDataTable } from "@/components/alerts/alerts-data-table"
import { alertsColumns } from "@/components/alerts/alerts-columns"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { AlertsInsights } from "@/components/alerts/alerts-insights"
import {AlertsClientTable} from "@/components/alerts/alerts-client-table";
import {LoadingSpinner} from "@/components/Spinner";

interface AlertsPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    size?: string
    column?: string
    order?: string
  }>
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  // Await searchParams first



  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Alerts requiring attention across all KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <AlertsClientTable />
              </Suspense> </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Alert Summary</CardTitle>
              <CardDescription>Overview of alert status and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsInsights/>
            </CardContent>
          </Card>
        </div>


      </div>
  )
}
