"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getKPIsByCategory } from "@/types/kpi-types"

// Generate realistic trend data based on our KPI data
const generateTrendData = () => {
  const continuousOpsKPIs = getKPIsByCategory("continuous_operations")

  // Select a few KPIs for the trend chart
  const selectedKPIs = [
    continuousOpsKPIs.find((kpi) => kpi.id === "expiry-writeoffs"),
    continuousOpsKPIs.find((kpi) => kpi.id === "inventory-accuracy"),
    continuousOpsKPIs.find((kpi) => kpi.id === "stockout-rate"),
  ].filter(Boolean)

  // Generate data points for the last 5 months
  const data = []
  const months = ["Jan", "Feb", "Mar", "Apr", "May"]

  for (let i = 0; i < months.length; i++) {
    const dataPoint: any = { date: months[i] }

    selectedKPIs.forEach((kpi) => {
      if (kpi) {
        // Start from current value and work backwards
        const changePerMonth = kpi.trendValue
        const monthsBack = months.length - 1 - i

        // Calculate value for this month with some random noise
        const noise = (Math.random() - 0.5) * (changePerMonth / 2) //NOSONAR
        const value = kpi.currentValue - (kpi.trend === "increasing" ? 1 : -1) * changePerMonth * monthsBack + noise

        dataPoint[kpi.name] = Number(Math.max(0, value).toFixed(1))
      }
    })

    data.push(dataPoint)
  }

  return { data, selectedKPIs }
}

const { data, selectedKPIs } = generateTrendData()

export function KPITrends() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                      <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                    </div>
                    {payload.map((item) => (
                      <div key={item.dataKey} className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{item.dataKey}</span>
                        <span className="font-bold" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        {selectedKPIs.map((kpi, index) => {
          const colors = ["#3B82F6", "#EF4444", "#F59E0B"]
          return (
            <Line
              key={kpi?.id}
              type="monotone"
              dataKey={kpi?.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}
