import type { Metadata } from "next"
import { SubmissionStatus } from "@/components/rafed-provider/submission-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Submission Status | Rafed Provider",
  description: "Track the status of your forecast submissions",
}

export default function SubmissionStatusPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Submission Status</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Submission Status</CardTitle>
          <CardDescription>Track the status of your forecast submissions and upcoming deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionStatus />
        </CardContent>
      </Card>
    </div>
  )
}
