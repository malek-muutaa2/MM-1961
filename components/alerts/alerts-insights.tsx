"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

ChartJS.register(ArcElement, Tooltip, Legend)

export function AlertsInsights() {
  // Sample data for alert insights
  const severityData = {
    labels: ["Critical", "Warning", "Info"],
    datasets: [
      {
        data: [2, 2, 2],
        backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6"],
        borderColor: ["#EF4444", "#F59E0B", "#3B82F6"],
        borderWidth: 1,
      },
    ],
  }

  const kpiData = {
    labels: ["Inventory", "Stockout", "Capital", "Order", "Shipping", "Supplier"],
    datasets: [
      {
        data: [1, 1, 1, 1, 1, 1],
        backgroundColor: ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#6B7280"],
        borderColor: ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#6B7280"],
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Alerts by Severity</h3>
        <div className="h-40">
          <Doughnut data={severityData} options={options} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Alerts by KPI</h3>
        <div className="h-40">
          <Doughnut data={kpiData} options={options} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Alert Trends</h3>
        <div className="space-y-2">
          <Card>
            <CardContent className="p-2 flex justify-between items-center">
              <span className="text-sm">Total Alerts</span>
              <span className="text-sm font-medium">6</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 flex justify-between items-center">
              <span className="text-sm">Unread Alerts</span>
              <span className="text-sm font-medium text-blue-500">3</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 flex justify-between items-center">
              <span className="text-sm">New Today</span>
              <span className="text-sm font-medium text-green-500">+2</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button className="w-full">Mark All as Read</Button>
    </div>
  )
}
