"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data for impact analysis
const impactData = {
  products: [
    { id: "1", name: "Product A", eventsCount: 3, impactScore: 85 },
    { id: "2", name: "Product B", eventsCount: 2, impactScore: 62 },
    { id: "3", name: "Product C", eventsCount: 2, impactScore: 45 },
    { id: "4", name: "Product D", eventsCount: 1, impactScore: 30 },
    { id: "5", name: "Product E", eventsCount: 1, impactScore: 25 },
    { id: "6", name: "Product F", eventsCount: 1, impactScore: 20 },
  ],
  facilities: [
    { id: "1", name: "Memorial Hospital", eventsCount: 2, impactScore: 75 },
    { id: "2", name: "City Hospital", eventsCount: 1, impactScore: 60 },
    { id: "3", name: "General Medical Center", eventsCount: 1, impactScore: 40 },
    { id: "4", name: "University Hospital", eventsCount: 1, impactScore: 35 },
  ],
}

export function EventsImpact() {
  const [timeframe, setTimeframe] = useState("6months")

  const getImpactColor = (score: number) => {
    if (score >= 70) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    if (score >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }

  const getImpactLevel = (score: number) => {
    if (score >= 70) return "High"
    if (score >= 40) return "Medium"
    return "Low"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Impact Analysis</h3>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="12months">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {impactData.products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{product.name}</h4>
                    <Badge className={getImpactColor(product.impactScore)}>{getImpactLevel(product.impactScore)}</Badge>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events:</span>
                      <span>{product.eventsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {impactData.facilities.map((facility) => (
              <Card key={facility.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{facility.name}</h4>
                    <Badge className={getImpactColor(facility.impactScore)}>
                      {getImpactLevel(facility.impactScore)}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events:</span>
                      <span>{facility.eventsCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
