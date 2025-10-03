"use client"

import { useState } from "react"
import { Calendar, Filter, Hospital, Package, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock data for product demands with Canadian hospital names
const productDemandData = [
  {
    id: 1,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 15000,
    previousDemand: 12000,
    trend: "up",
    hospital: "Toronto General Hospital",
  },
  {
    id: 2,
    name: "Nitrile Gloves",
    category: "PPE",
    currentDemand: 25000,
    previousDemand: 28000,
    trend: "down",
    hospital: "Toronto General Hospital",
  },
  {
    id: 3,
    name: "Ventilators",
    category: "Equipment",
    currentDemand: 120,
    previousDemand: 100,
    trend: "up",
    hospital: "Toronto General Hospital",
  },
  {
    id: 4,
    name: "IV Solutions",
    category: "Consumables",
    currentDemand: 8500,
    previousDemand: 8200,
    trend: "up",
    hospital: "Toronto General Hospital",
  },
  {
    id: 5,
    name: "Antibiotics",
    category: "Pharmaceuticals",
    currentDemand: 4200,
    previousDemand: 4500,
    trend: "down",
    hospital: "Toronto General Hospital",
  },
  {
    id: 6,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 8000,
    previousDemand: 7000,
    trend: "up",
    hospital: "SickKids Hospital",
  },
  {
    id: 7,
    name: "Nitrile Gloves",
    category: "PPE",
    currentDemand: 12000,
    previousDemand: 13000,
    trend: "down",
    hospital: "SickKids Hospital",
  },
  {
    id: 8,
    name: "Pediatric Ventilators",
    category: "Equipment",
    currentDemand: 50,
    previousDemand: 40,
    trend: "up",
    hospital: "SickKids Hospital",
  },
  {
    id: 9,
    name: "IV Solutions",
    category: "Consumables",
    currentDemand: 4200,
    previousDemand: 4000,
    trend: "up",
    hospital: "SickKids Hospital",
  },
  {
    id: 10,
    name: "Antibiotics",
    category: "Pharmaceuticals",
    currentDemand: 2100,
    previousDemand: 2300,
    trend: "down",
    hospital: "SickKids Hospital",
  },
  {
    id: 11,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 12000,
    previousDemand: 10500,
    trend: "up",
    hospital: "Sunnybrook Health Sciences Centre",
  },
  {
    id: 12,
    name: "Nitrile Gloves",
    category: "PPE",
    currentDemand: 18000,
    previousDemand: 19000,
    trend: "down",
    hospital: "Sunnybrook Health Sciences Centre",
  },
  {
    id: 13,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 9500,
    previousDemand: 8800,
    trend: "up",
    hospital: "Vancouver General Hospital",
  },
  {
    id: 14,
    name: "Antibiotics",
    category: "Pharmaceuticals",
    currentDemand: 3800,
    previousDemand: 3600,
    trend: "up",
    hospital: "Vancouver General Hospital",
  },
  {
    id: 15,
    name: "IV Solutions",
    category: "Consumables",
    currentDemand: 7200,
    previousDemand: 7500,
    trend: "down",
    hospital: "Montreal General Hospital",
  },
]

// Mock data for top demanded products
const topDemandedProducts = [
  { name: "Surgical Masks", demand: 44500, percentChange: 15.2 },
  { name: "Nitrile Gloves", demand: 55000, percentChange: -3.6 },
  { name: "IV Solutions", demand: 19900, percentChange: 3.7 },
  { name: "Antibiotics", demand: 10100, percentChange: -2.4 },
  { name: "Ventilators", demand: 170, percentChange: 17.2 },
]

// Mock data for demand by category
const demandByCategory = [
  { category: "PPE", demand: 99500, percentChange: 5.2 },
  { category: "Pharmaceuticals", demand: 45000, percentChange: -2.1 },
  { category: "Consumables", demand: 32000, percentChange: 3.8 },
  { category: "Equipment", demand: 15000, percentChange: 12.5 },
  { category: "Diagnostics", demand: 8000, percentChange: 7.3 },
]

export default function ProductDemandsPage() {
  const [viewMode, setViewMode] = useState<"aggregated" | "byHospital">("aggregated")
  const [selectedHospital, setSelectedHospital] = useState<string>("all")

  // Filter products based on selected hospital
  let filteredProducts = productDemandData
  if (viewMode === "byHospital") {
    filteredProducts =
      selectedHospital === "all"
        ? productDemandData
        : productDemandData.filter((product) => product.hospital === selectedHospital)
  }

  // Get unique hospitals
  const hospitals = Array.from(new Set(productDemandData.map((product) => product.hospital)))

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Demand</h1>
          <p className="text-muted-foreground">Monitor and analyze product demand across your healthcare facilities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Product Demand</CardTitle>
            <CardDescription>Across all facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">199,600</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-500">↑ 5.2%</span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Critical Shortages</CardTitle>
            <CardDescription>Products below threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-red-500">↑ 2</span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Demand Volatility</CardTitle>
            <CardDescription>Average fluctuation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.3%</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-amber-500">↔ 0.5%</span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Top Demanded Products</CardTitle>
            <CardDescription>Across all facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDemandedProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span>{product.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.demand.toLocaleString()}</span>
                    <Badge variant={product.percentChange > 0 ? "default" : "destructive"} className="ml-2">
                      {product.percentChange > 0 ? "+" : ""}
                      {product.percentChange}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Demand by Category</CardTitle>
            <CardDescription>Grouped by product type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demandByCategory.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span>{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.demand.toLocaleString()}</span>
                    <Badge variant={category.percentChange > 0 ? "default" : "destructive"} className="ml-2">
                      {category.percentChange > 0 ? "+" : ""}
                      {category.percentChange}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Product Demand Details</CardTitle>
              <CardDescription>View detailed demand data for all products</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Tabs
                  defaultValue="aggregated"
                  onValueChange={(value) => setViewMode(value as "aggregated" | "byHospital")}
                >
                  <TabsList>
                    <TabsTrigger value="aggregated">Aggregated</TabsTrigger>
                    <TabsTrigger value="byHospital">By Hospital</TabsTrigger>
                  </TabsList>
                </Tabs>

                {viewMode === "byHospital" && (
                  <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                    <SelectTrigger className="w-[240px]">
                      <SelectValue placeholder="Select Hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hospitals</SelectItem>
                      {hospitals.map((hospital, index) => (
                        <SelectItem key={hospital} value={hospital}>
                          {hospital}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-8 w-full sm:w-[250px]" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 border-b bg-muted/50 p-2 font-medium">
              <div className="col-span-2">Product</div>
              <div className="col-span-1 text-center">Category</div>
              <div className="col-span-1 text-center">Current Demand</div>
              <div className="col-span-1 text-center">Previous</div>
              <div className="col-span-1 text-center">Trend</div>
            </div>
            <div className="divide-y">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-6 p-2">
                  <div className="col-span-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{product.name}</span>
                    {viewMode === "byHospital" && selectedHospital === "all" && (
                      <Badge variant="outline" className="ml-2">
                        <Hospital className="mr-1 h-3 w-3" />
                        {product.hospital}
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-1 text-center">{product.category}</div>
                  <div className="col-span-1 text-center font-medium">{product.currentDemand.toLocaleString()}</div>
                  <div className="col-span-1 text-center text-muted-foreground">
                    {product.previousDemand.toLocaleString()}
                  </div>
                  <div className="col-span-1 text-center">
                    <Badge variant={product.trend === "up" ? "default" : "destructive"}>
                      {product.trend === "up" ? "↑" : "↓"}{" "}
                      {Math.abs(
                        ((product.currentDemand - product.previousDemand) / product.previousDemand) * 100,
                      ).toFixed(1)}
                      %
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
