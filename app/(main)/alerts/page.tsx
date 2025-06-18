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

async function getAlerts(searchParams: {
  page?: string
  search?: string
  size?: string
  column?: string
  order?: string
}) {
  const page = searchParams.page || "1"
  const search = searchParams.search || ""
  const size = searchParams.size || "10"
  const column = searchParams.column || "triggeredAt"
  const order = searchParams.order || "desc"

  const params = new URLSearchParams({
    page,
    size,
    ...(search && { search }),
    ...(column && { column }),
    ...(order && { order }),
  })

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/alerts?${params}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch alerts")
  }

  return response.json()
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  // Await searchParams first
  const resolvedSearchParams = await searchParams

  const data = await getAlerts(resolvedSearchParams)
  const pageNumber = Number.parseInt(resolvedSearchParams.page || "1")
  const size = resolvedSearchParams.size || "10"
  const search = resolvedSearchParams.search || null
  const column = resolvedSearchParams.column || "triggeredAt"
  const order = resolvedSearchParams.order || "desc"

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
