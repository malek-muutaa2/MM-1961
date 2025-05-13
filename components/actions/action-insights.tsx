"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Card, CardContent } from "@/components/ui/card"

ChartJS.register(ArcElement, Tooltip, Legend)

export function ActionInsights() {
  // Sample data for action insights
  const statusData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [2, 2, 1],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
        borderColor: ["#10B981", "#3B82F6", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  }

  const priorityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [3, 2, 0],
        backgroundColor: ["#EF4444", "#F59E0B", "#6B7280"],
        borderColor: ["#EF4444", "#F59E0B", "#6B7280"],
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
        <h3 className="text-sm font-medium">Action Status</h3>
        <div className="h-40">
          <Doughnut data={statusData} options={options} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Action Priority</h3>
        <div className="h-40">
          <Doughnut data={priorityData} options={options} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">KPI Impact Summary</h3>
        <div className="space-y-2">
          <Card>
            <CardContent className="p-2 flex justify-between items-center">
              <span className="text-sm">Inventory Levels</span>
              <span className="text-sm font-medium text-blue-500">-15%</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 flex justify-between items-center">
              <span className="text-sm">Shipping Costs</span>
              <span className="text-sm font-medium text-blue-500">-8%</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 flex justify-between items-center">
              <span className="text-sm">Waste Reduction</span>
              <span className="text-sm font-medium text-blue-500">-12%</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
