"use client"

import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, Download, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ForecastDetailsProps {
  id: string
}

export function ForecastDetails({ id }: ForecastDetailsProps) {
  // In a real app, you would fetch this data based on the ID
  const forecastDetails = {
    id,
    fileName: "September2023_Forecast.xlsx",
    uploadDate: "2023-09-20T10:05:00",
    status: "approved",
    month: "September",
    year: "2023",
    fileSize: "2.6 MB",
    uploadedBy: "John Doe",
    approvedBy: "Rafed Admin",
    approvedDate: "2023-09-21T14:30:00",
    comments: "All data validated successfully.",
    productCount: 156,
    totalForecastQuantity: 12450,
    validationIssues: 0,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">{forecastDetails.fileName}</h3>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {forecastDetails.month} {forecastDetails.year} Forecast
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">{getStatusBadge(forecastDetails.status)}</div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Submission Details</h4>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Upload Date:</span>
              <span className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                {new Date(forecastDetails.uploadDate).toLocaleDateString()} at{" "}
                {new Date(forecastDetails.uploadDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm">Uploaded By:</span>
              <span className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-1 text-muted-foreground" />
                {forecastDetails.uploadedBy}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm">File Size:</span>
              <span className="text-sm font-medium">{forecastDetails.fileSize}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Validation Results</h4>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Status:</span>
              <span className="text-sm font-medium">{getStatusBadge(forecastDetails.status)}</span>
            </div>

            {forecastDetails.status === "approved" && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm">Approved By:</span>
                  <span className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-1 text-muted-foreground" />
                    {forecastDetails.approvedBy}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Approved Date:</span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {new Date(forecastDetails.approvedDate).toLocaleDateString()} at{" "}
                    {new Date(forecastDetails.approvedDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span className="text-sm">Validation Issues:</span>
              <span className="text-sm font-medium">
                {forecastDetails.validationIssues === 0 ? (
                  <span className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    No issues found
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {forecastDetails.validationIssues} issues found
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Forecast Summary</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-2xl font-bold mt-1">{forecastDetails.productCount}</div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Forecast Quantity</div>
            <div className="text-2xl font-bold mt-1">{forecastDetails.totalForecastQuantity.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {forecastDetails.comments && (
        <>
          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Comments</h4>
            <p className="text-sm">{forecastDetails.comments}</p>
          </div>
        </>
      )}

      <Separator />

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Original
        </Button>

        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Resubmit
        </Button>
      </div>
    </div>
  )
}
