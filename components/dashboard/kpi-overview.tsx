"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"
import { getKPIsByCategory } from "@/types/kpi-types"

export function KPIOverview() {
  // Get continuous operations KPIs for the overview
  const continuousOpsKPIs = getKPIsByCategory("continuous_operations")

  // Format data for the chart
  const data = continuousOpsKPIs.map((kpi) => ({
    name: kpi.name,
    value: kpi.currentValue,
    target: kpi.targetValue,
    status: kpi.status,
    unit: kpi.unit,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}${data[0].unit === "percentage" ? "%" : ""}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">KPI</span>
                      <span className="font-bold text-muted-foreground">{data.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Current</span>
                      <span className="font-bold text-muted-foreground">
                        {data.value}
                        {data.unit === "percentage" ? "%" : data.unit === "days" ? " days" : ""}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Target</span>
                      <span className="font-bold text-muted-foreground">
                        {data.target}
                        {data.unit === "percentage" ? "%" : data.unit === "days" ? " days" : ""}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Status</span>
                      <span
                        className={`font-bold ${
                          data.status === "on_target"
                            ? "text-green-500"
                            : data.status === "warning"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {data.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        {data.map((item, index) => (
          <ReferenceLine
            key={`ref-${index}`}
            y={item.target}
            segment={[
              { x: index - 0.4, y: item.target },
              { x: index + 0.4, y: item.target },
            ]}
            stroke="#F59E0B"
            strokeDasharray="3 3"
          />
        ))}
        <Bar
          dataKey="value"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          barSize={30}
          fill={(data) => {
            return data.status === "on_target" ? "#10B981" : data.status === "warning" ? "#F59E0B" : "#EF4444"
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
