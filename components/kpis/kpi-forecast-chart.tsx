"use client"

import { Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Area, ComposedChart } from "recharts"
import { getKPIById, getKPIForecastData } from "@/types/kpi-types"

export function KPIForecastChart({ kpiId }: { kpiId: string }) {
  // Get KPI data
  const kpi = getKPIById(kpiId)

  // Get forecast data for the KPI
  const data = getKPIForecastData(kpiId, 90)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-muted-foreground">Actual</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-muted-foreground">Forecast</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-blue-200"></div>
          <span className="text-sm text-muted-foreground">Confidence Interval</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 border-2 border-dashed border-amber-500 rounded-full"></div>
          <span className="text-sm text-muted-foreground">Target</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
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
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-muted-foreground">{data.date}</span>
                      </div>
                      {data.actual !== null && (
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Actual</span>
                          <span className="font-bold text-blue-500">
                            {data.actual}
                            {kpi?.unit === "percentage" ? "%" : kpi?.unit === "days" ? " days" : ""}
                          </span>
                        </div>
                      )}
                      {data.forecast !== null && (
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Forecast</span>
                          <span className="font-bold text-green-500">
                            {data.forecast}
                            {kpi?.unit === "percentage" ? "%" : kpi?.unit === "days" ? " days" : ""}
                          </span>
                        </div>
                      )}
                      {data.lower !== null && data.upper !== null && (
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Range</span>
                          <span className="font-bold text-blue-300">
                            {data.lower}
                            {kpi?.unit === "percentage" ? "%" : kpi?.unit === "days" ? " days" : ""} -{data.upper}
                            {kpi?.unit === "percentage" ? "%" : kpi?.unit === "days" ? " days" : ""}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Target</span>
                        <span className="font-bold text-amber-500">
                          {data.target}
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
          <Area type="monotone" dataKey="upper" stroke="transparent" fill="#BFDBFE" fillOpacity={0.5} />
          <Area type="monotone" dataKey="lower" stroke="transparent" fill="#BFDBFE" fillOpacity={0.5} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
