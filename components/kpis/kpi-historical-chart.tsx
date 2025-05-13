"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"
import { Button } from "@/components/ui/button"
import { getKPIById, getKPIHistoricalData } from "@/types/kpi-types"

export function KPIHistoricalChart({ kpiId }: { kpiId: string }) {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y">("90d")

  // Get KPI data
  const kpi = getKPIById(kpiId)

  // Get historical data for the KPI
  const data = getKPIHistoricalData(kpiId, timeRange)

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
          30 Days
        </Button>
        <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
          90 Days
        </Button>
        <Button variant={timeRange === "1y" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("1y")}>
          1 Year
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}${kpi?.unit === "percentage" ? "%" : ""}`}
            domain={["dataMin - 5", "dataMax + 5"]}
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
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                        <span className="font-bold text-primary">
                          {payload[0].value}
                          {kpi?.unit === "percentage" ? "%" : kpi?.unit === "days" ? " days" : ""}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Target</span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].payload.target}
                          {kpi?.unit === "percentage" ? "%" : kpi?.unit === "days" ? " days" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <ReferenceLine
            y={kpi?.targetValue}
            stroke="#F59E0B"
            strokeDasharray="3 3"
            label={{
              value: "Target",
              position: "right",
              fill: "#F59E0B",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
