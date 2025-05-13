"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, TrendingDown, Info, ExternalLink } from "lucide-react"
import Link from "next/link"

interface AnomalyStatisticsProps {
  isNewSubmission?: boolean
}

type AnomalyType = "spike" | "drop" | "inconsistent" | "seasonal"
type SeverityType = "critical" | "high" | "medium" | "low"

interface Anomaly {
  id: string
  forecastId: string
  productName: string
  sku: string
  anomalyType: AnomalyType
  severity: SeverityType
  description: string
  detectedAt: string
  acknowledged: boolean
}

export function AnomalyStatistics({ isNewSubmission = false }: AnomalyStatisticsProps) {
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    total: 0,
    acknowledged: 0,
    unacknowledged: 0,
    bySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  })
  const [recentAnomalies, setRecentAnomalies] = useState<Anomaly[]>([])

  useEffect(() => {
    // Simulate API call to fetch anomaly statistics
    setLoading(true)
    setTimeout(() => {
      // Mock data for statistics
      const mockStatistics = {
        total: 18,
        acknowledged: 11,
        unacknowledged: 7,
        bySeverity: {
          critical: 2,
          high: 5,
          medium: 8,
          low: 3,
        },
      }

      // Mock data for recent unacknowledged anomalies
      const mockRecentAnomalies: Anomaly[] = [
        {
          id: "anom-1",
          forecastId: "1",
          productName: "Paracetamol",
          sku: "PHARM-2001",
          anomalyType: "spike",
          severity: "critical",
          description: "Unusual 150% increase compared to historical trend",
          detectedAt: "2025-04-18T10:30:00Z",
          acknowledged: false,
        },
        {
          id: "anom-2",
          forecastId: "1",
          productName: "Amoxicillin",
          sku: "PHARM-2002",
          anomalyType: "drop",
          severity: "high",
          description: "Unexpected 40% decrease from previous month",
          detectedAt: "2025-04-17T14:45:00Z",
          acknowledged: false,
        },
        {
          id: "anom-3",
          forecastId: "2",
          productName: "Metformin",
          sku: "PHARM-2005",
          anomalyType: "inconsistent",
          severity: "medium",
          description: "Inconsistent with seasonal pattern from previous years",
          detectedAt: "2025-04-16T09:15:00Z",
          acknowledged: false,
        },
      ]

      setStatistics(mockStatistics)
      setRecentAnomalies(mockRecentAnomalies)
      setLoading(false)
    }, 1000)
  }, [])

  const getAnomalyTypeIcon = (type: AnomalyType) => {
    switch (type) {
      case "spike":
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case "drop":
        return <TrendingDown className="h-4 w-4 text-amber-600" />
      case "inconsistent":
      case "seasonal":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: SeverityType) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Critical</Badge>
      case "high":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const acknowledgePercentage = statistics.total > 0 ? (statistics.acknowledged / statistics.total) * 100 : 0
  const className = ""

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{isNewSubmission ? "Submission Anomalies" : "Anomaly Statistics"}</CardTitle>
          <CardDescription>Loading anomaly statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Anomaly Statistics
        </CardTitle>
        <CardDescription>Review and acknowledge anomalies to improve forecast accuracy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Acknowledgement Progress</h3>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {statistics.acknowledged} of {statistics.total} acknowledged
                </span>
                <span className="text-sm font-medium">{Math.round(acknowledgePercentage)}%</span>
              </div>
              <Progress value={acknowledgePercentage} className="h-2" />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">Anomalies by Severity</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Critical</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.bySeverity.critical}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">High</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.bySeverity.high}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.bySeverity.medium}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Low</span>
                  </div>
                  <span className="text-sm font-medium">{statistics.bySeverity.low}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild className="w-full">
                <Link href="/rafed-provider/history/1?tab=anomalies">
                  View All Anomalies
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Recent Unacknowledged Anomalies</h3>
            {recentAnomalies.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAnomalies.map((anomaly) => (
                      <TableRow key={anomaly.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{anomaly.productName}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(anomaly.detectedAt)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getAnomalyTypeIcon(anomaly.anomalyType)}
                            <span className="text-xs capitalize">{anomaly.anomalyType}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm" className="h-8 w-full px-2 text-xs">
                            <Link href={`/rafed-provider/history/${anomaly.forecastId}?tab=anomalies`}>Review</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-md border">
                <p className="text-sm text-muted-foreground">No unacknowledged anomalies</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
