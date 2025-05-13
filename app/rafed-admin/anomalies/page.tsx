import type { Metadata } from "next"
import { AnomalyDetection } from "@/components/rafed-admin/anomaly-detection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Anomaly Detection | Rafed Admin",
  description: "Detect and analyze anomalies in provider forecasts",
}

export default function AnomalyDetectionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Anomaly Detection</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Anomalies</CardTitle>
          <CardDescription>Detect and analyze anomalies in provider forecasts</CardDescription>
        </CardHeader>
        <CardContent>
          <AnomalyDetection />
        </CardContent>
      </Card>
    </div>
  )
}
