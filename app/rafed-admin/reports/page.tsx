import type { Metadata } from "next"
import { SubmissionReports } from "@/components/rafed-admin/submission-reports"

export const metadata: Metadata = {
  title: "Submission Reports | Rafed Admin",
  description: "View and analyze provider submission reports and aggregated forecasts",
}

export default function SubmissionReportsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Submission Reports</h1>
      </div>
      <SubmissionReports />
    </div>
  )
}
