"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ForecastChartProps {
  forecastId: string
}

export function ForecastChart({ forecastId }: ForecastChartProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch forecast data
    setLoading(true)
    setTimeout(() => {
      // Mock data for the chart
      const mockCategoryData = [
        { name: "Surgical Supplies", value: 12500 },
        { name: "Pharmaceuticals", value: 8200 },
        { name: "Diagnostic Equipment", value: 3600 },
        { name: "Personal Protective Equipment", value: 2800 },
        { name: "Laboratory Supplies", value: 1650 },
      ]

      setData(mockCategoryData)
      setLoading(false)
    }, 1000)
  }, [forecastId])

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} units`, "Quantity"]} />
        <Legend />
        <Bar dataKey="value" name="Forecast Quantity" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}
