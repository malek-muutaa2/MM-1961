"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, ExternalLink, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { ForecastFile } from "@/types/rafed-types"

interface PreviousUploadsProps {
  searchQuery: string
  yearFilter: string
  monthFilter: string
  statusFilter: string
}

export function PreviousUploads({ searchQuery, yearFilter, monthFilter, statusFilter }: PreviousUploadsProps) {
  const [uploads, setUploads] = useState<ForecastFile[]>([])
  const [allPeriods, setAllPeriods] = useState<{ year: number; month: number; label: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch uploads
    setLoading(true)
    setTimeout(() => {
      const mockUploads: ForecastFile[] = [
        {
          id: "1",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-may-2025.xlsx",
          uploadDate: "2025-04-15T10:30:00Z",
          forecastPeriod: "May 2025",
          status: "submitted",
          year: 2025,
          month: 5,
          anomalies: 12,
          acknowledgedAnomalies: 8,
        },
        {
          id: "2",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-april-2025.xlsx",
          uploadDate: "2025-03-20T14:45:00Z",
          forecastPeriod: "April 2025",
          status: "submitted",
          year: 2025,
          month: 4,
          anomalies: 7,
          acknowledgedAnomalies: 7,
        },
        {
          id: "3",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-march-2025.xlsx",
          uploadDate: "2025-02-18T09:15:00Z",
          forecastPeriod: "March 2025",
          status: "submitted",
          year: 2025,
          month: 3,
          anomalies: 15,
          acknowledgedAnomalies: 4,
        },
        {
          id: "4",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-february-2025.xlsx",
          uploadDate: "2025-01-22T11:20:00Z",
          forecastPeriod: "February 2025",
          status: "submitted",
          year: 2025,
          month: 2,
          anomalies: 9,
          acknowledgedAnomalies: 9,
        },
        {
          id: "5",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-january-2025.xlsx",
          uploadDate: "2024-12-20T16:30:00Z",
          forecastPeriod: "January 2025",
          status: "submitted",
          year: 2025,
          month: 1,
          anomalies: 5,
          acknowledgedAnomalies: 2,
        },
        {
          id: "6",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-december-2024.xlsx",
          uploadDate: "2024-11-19T13:45:00Z",
          forecastPeriod: "December 2024",
          status: "submitted",
          year: 2024,
          month: 12,
          anomalies: 11,
          acknowledgedAnomalies: 0,
        },
        // November 2024 is missing
        {
          id: "7",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-october-2024.xlsx",
          uploadDate: "2024-09-22T10:15:00Z",
          forecastPeriod: "October 2024",
          status: "submitted",
          year: 2024,
          month: 10,
          anomalies: 6,
          acknowledgedAnomalies: 3,
        },
        {
          id: "8",
          providerId: "provider-123",
          providerName: "Medical Supplies Inc.",
          fileName: "forecast-september-2024.xlsx",
          uploadDate: "2024-08-20T09:30:00Z",
          forecastPeriod: "September 2024",
          status: "submitted",
          year: 2024,
          month: 9,
          anomalies: 8,
          acknowledgedAnomalies: 5,
        },
      ]

      // Generate all periods (including missing ones)
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1

      // Generate periods for the last 12 months (reduced from 24)
      const periods: { year: number; month: number; label: string }[] = []
      for (let i = 0; i < 12; i++) {
        let year = currentYear
        let month = currentMonth - i

        if (month <= 0) {
          month += 12
          year -= 1
        }

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

        periods.push({
          year,
          month,
          label: `${monthNames[month - 1]} ${year}`,
        })
      }

      setAllPeriods(periods)
      setUploads(mockUploads)
      setLoading(false)
    }, 1000)
  }, [])

  // Generate a complete list of periods with submission status
  const completeSubmissionList = allPeriods.map((period) => {
    const existingUpload = uploads.find((upload) => upload.year === period.year && upload.month === period.month)

    if (existingUpload) {
      return existingUpload
    } else {
      // Create a placeholder for missing submissions
      return {
        id: `missing-${period.year}-${period.month}`,
        providerId: "provider-123",
        providerName: "Medical Supplies Inc.",
        fileName: "",
        uploadDate: "",
        forecastPeriod: period.label,
        status: "not-submitted" as any, // Type assertion
        year: period.year,
        month: period.month,
        anomalies: 0,
        acknowledgedAnomalies: 0,
      }
    }
  })

  // Filter submissions based on search query and filters
  const filteredSubmissions = completeSubmissionList.filter((submission) => {
    const matchesSearch =
      submission.forecastPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (submission.fileName && submission.fileName.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesYear = yearFilter === "all" || submission.year.toString() === yearFilter

    const matchesMonth = monthFilter === "all" || submission.month.toString() === monthFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "submitted" && submission.status === "submitted") ||
      (statusFilter === "not-submitted" && submission.status === "not-submitted")

    return matchesSearch && matchesYear && matchesMonth && matchesStatus
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "—"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  // Render status badge with appropriate color and icon
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Submitted
          </Badge>
        )
      case "not-submitted":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-500 hover:bg-gray-200">
            <XCircle className="h-3 w-3" />
            Not Submitted
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Unknown
          </Badge>
        )
    }
  }

  // Render anomaly status with appropriate color
  const renderAnomalyStatus = (anomalies: number, acknowledgedAnomalies: number) => {
    if (anomalies === 0) return "—"

    const acknowledgedPercent = (acknowledgedAnomalies / anomalies) * 100

    let textColor = "text-red-600"
    let icon = <AlertTriangle className="h-4 w-4 mr-1" />

    if (acknowledgedPercent === 100) {
      textColor = "text-green-600"
      icon = <CheckCircle className="h-4 w-4 mr-1" />
    } else if (acknowledgedPercent >= 50) {
      textColor = "text-amber-500"
      icon = <AlertTriangle className="h-4 w-4 mr-1" />
    }

    return (
      <div className={`flex items-center ${textColor}`}>
        {icon}
        <span>
          {acknowledgedAnomalies}/{anomalies} acknowledged
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (filteredSubmissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="text-lg font-medium">No submissions found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Forecast Period</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Anomalies</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell className="font-medium">{submission.forecastPeriod}</TableCell>
              <TableCell>{submission.fileName || "—"}</TableCell>
              <TableCell>{formatDate(submission.uploadDate)}</TableCell>
              <TableCell>{renderStatusBadge(submission.status)}</TableCell>
              <TableCell>
                {submission.status === "submitted"
                  ? renderAnomalyStatus(submission.anomalies, submission.acknowledgedAnomalies)
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                {submission.status === "submitted" ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-1 border-primary text-primary hover:bg-primary/10"
                  >
                    <Link href={`/rafed-provider/history/${submission.id}`}>
                      <span>View Details</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">No actions available</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
