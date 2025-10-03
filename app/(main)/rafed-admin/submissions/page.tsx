import type { Metadata } from "next"
import { ProviderSubmissions } from "@/components/rafed-admin/provider-submissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Provider Submissions | Rafed Admin",
  description: "Monitor and manage provider forecast submissions",
}

export default function ProviderSubmissionsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Provider Submissions</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Submissions</CardTitle>
          <CardDescription>Monitor and manage provider forecast submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderSubmissions />
        </CardContent>
      </Card>
    </div>
  )
}
