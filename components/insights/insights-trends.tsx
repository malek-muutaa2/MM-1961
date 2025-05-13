"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample trends data
const trendsData = {
  inventory: [
    { date: "Jan", value: 80, forecast: 82 },
    { date: "Feb", value: 82, forecast: 83 },
    { date: "Mar", value: 79, forecast: 81 },
    { date: "Apr", value: 83, forecast: 84 },
    { date: "May", value: 85, forecast: 86 },
    { date: "Jun", value: 87, forecast: 88 },
    { date: "Jul", value: 89, forecast: 90 },
    { date: "Aug", value: 91, forecast: 91 },
    { date: "Sep", value: 93, forecast: 92 },
    { date: "Oct", value: null, forecast: 93 },
    { date: "Nov", value: null, forecast: 94 },
    { date: "Dec", value: null, forecast: 95 },
  ],
  stockout: [
    { date: "Jan", value: 15, forecast: 14 },
    { date: "Feb", value: 14, forecast: 13 },
    { date: "Mar", value: 16, forecast: 15 },
    { date: "Apr", value: 13, forecast: 12 },
    { date: "May", value: 12, forecast: 11 },
    { date: "Jun", value: 11, forecast: 10 },
    { date: "Jul", value: 10, forecast: 9 },
    { date: "Aug", value: 9, forecast: 8 },
    { date: "Sep", value: 8, forecast: 7 },
    { date: "Oct", value: null, forecast: 7 },
    { date: "Nov", value: null, forecast: 6 },
    { date: "Dec", value: null, forecast: 6 },
  ],
  shipping: [
    { date: "Jan", value: 12, forecast: 11.5 },
    { date: "Feb", value: 11.5, forecast: 11 },
    { date: "Mar", value: 11, forecast: 10.5 },
    { date: "Apr", value: 10.5, forecast: 10 },
    { date: "May", value: 10, forecast: 9.5 },
    { date: "Jun", value: 9.5, forecast: 9 },
    { date: "Jul", value: 9, forecast: 8.5 },
    { date: "Aug", value: 8.5, forecast: 8 },
    { date: "Sep", value: 8, forecast: 7.5 },
    { date: "Oct", value: null, forecast: 7.5 },
    { date: "Nov", value: null, forecast: 7 },
    { date: "Dec", value: null, forecast: 7 },
  ],
}

export function InsightsTrends({ fullHeight = false }: { fullHeight?: boolean }) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="inventory">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory Levels</TabsTrigger>
          <TabsTrigger value="stockout">Stockout Risk</TabsTrigger>
          <TabsTrigger value="shipping">Shipping Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={fullHeight ? 450 : 300}>
                <LineChart data={trendsData.inventory} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Actual" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="AI Forecast"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">AI Insights:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Inventory levels show a consistent upward trend over the past 9 months.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>AI forecasts continued growth, reaching optimal levels by December.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Seasonal patterns suggest potential for optimization in Q4.</span>
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="stockout">
          <Card>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={fullHeight ? 450 : 300}>
                <LineChart data={trendsData.stockout} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Actual" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="AI Forecast"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">AI Insights:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Stockout risk has been steadily decreasing as inventory management improves.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>AI forecasts continued reduction in stockout risk through year-end.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>March showed an anomaly with increased risk that should be investigated.</span>
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={fullHeight ? 450 : 300}>
                <LineChart data={trendsData.shipping} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Actual" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="AI Forecast"
                    stroke="#EC4899"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">AI Insights:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Shipping costs show a consistent downward trend as consolidation efforts take effect.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>AI forecasts continued cost reduction, stabilizing around 7% by year-end.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>The rate of improvement is slowing, suggesting diminishing returns on current strategies.</span>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
