"use client"

import { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface AlertInsights {
  severityStats: Array<{ severity: string; count: number }>
  statusStats: Array<{ status: string; count: number }>
  totalAlerts: number
  activeAlerts: number
  resolvedAlerts: number
}

export function AlertsInsights() {
  const [insights, setInsights] = useState<AlertInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("/api/alerts/insights")
        if (response.ok) {
          const data = await response.json()
          setInsights(data)
          console.log("Fetched alert insights:", data)
        }
      } catch (error) {
        console.error("Error fetching alert insights:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

  if (isLoading) {
    return (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
    )
  }

  if (!insights) {
    return (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">Failed to load alert insights</p>
        </div>
    )
  }

  // Prepare severity chart data
  const severityData = {
    labels: insights.severityStats.map((stat) => stat.severity),
    datasets: [
      {
        data: insights.severityStats.map((stat) => stat.count),
        backgroundColor: insights.severityStats.map((stat) => {
          switch (stat.severity) {
            case "critical":
              return "#EF4444"
            case "warning":
              return "#F59E0B"
            case "info":
              return "#3B82F6"
            default:
              return "#6B7280"
          }
        }),
        borderColor: insights.severityStats.map((stat) => {
          switch (stat.severity) {
            case "critical":
              return "#EF4444"
            case "warning":
              return "#F59E0B"
            case "info":
              return "#3B82F6"
            default:
              return "#6B7280"
          }
        }),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Alerts by Severity</h3>
          <div className="h-40">
            <Doughnut data={severityData} options={options} />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Severity Breakdown</h3>
          <div className="space-y-2">
            {insights.severityStats.map((stat) => (
                <Card key={stat.severity}>
                  <CardContent className="p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(stat.severity)}
                      <span className="text-sm capitalize">{stat.severity}</span>
                    </div>
                    <Badge variant="secondary" className="text-sm font-medium">
                      {stat.count}
                    </Badge>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Alert Summary</h3>
          <div className="space-y-2">
            <Card>
              <CardContent className="p-3 flex justify-between items-center">
                <span className="text-sm">Total Alerts</span>
                <Badge variant="outline" className="text-sm font-medium">
                  {insights.totalAlerts}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex justify-between items-center">
                <span className="text-sm">Active Alerts</span>
                <Badge variant="destructive" className="text-sm font-medium">
                  {insights.activeAlerts}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 flex justify-between items-center">
                <span className="text-sm">Resolved Alerts</span>
                <Badge variant="default" className="text-sm font-medium">
                  {insights.resolvedAlerts}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
