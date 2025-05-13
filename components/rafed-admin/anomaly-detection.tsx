"use client"

import { useState } from "react"
import { AlertTriangle, Search, TrendingUp, ArrowUpDown, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for anomalies
const sampleAnomalies = [
  {
    id: "1",
    productId: "MED-001",
    name: "Paracetamol 500mg",
    category: "Medications",
    provider: "King Faisal Specialist Hospital",
    region: "Riyadh",
    forecastQuantity: 1200,
    historicalAverage: 800,
    percentageChange: 50,
    anomalyScore: 0.85,
    anomalyType: "sudden_increase",
    unit: "Boxes",
    detectedDate: "2023-05-15",
    impact: "high",
  },
  {
    id: "2",
    productId: "SUP-002",
    name: "Surgical Masks",
    category: "Medical Supplies",
    provider: "King Abdulaziz Medical City",
    region: "Jeddah",
    forecastQuantity: 2000,
    historicalAverage: 3500,
    percentageChange: -42.9,
    anomalyScore: 0.75,
    anomalyType: "sudden_decrease",
    unit: "Boxes",
    detectedDate: "2023-05-14",
    impact: "medium",
  },
  {
    id: "3",
    productId: "MED-015",
    name: "Insulin",
    category: "Medications",
    provider: "King Fahad Medical City",
    region: "Riyadh",
    forecastQuantity: 600,
    historicalAverage: 350,
    percentageChange: 71.4,
    anomalyScore: 0.9,
    anomalyType: "sudden_increase",
    unit: "Vials",
    detectedDate: "2023-05-16",
    impact: "high",
  },
  {
    id: "4",
    productId: "EQP-008",
    name: "Ventilator Filters",
    category: "Equipment",
    provider: "Prince Sultan Military Medical City",
    region: "Riyadh",
    forecastQuantity: 50,
    historicalAverage: 120,
    percentageChange: -58.3,
    anomalyScore: 0.8,
    anomalyType: "sudden_decrease",
    unit: "Boxes",
    detectedDate: "2023-05-13",
    impact: "high",
  },
  {
    id: "5",
    productId: "LAB-023",
    name: "PCR Test Kits",
    category: "Laboratory",
    provider: "King Khalid University Hospital",
    region: "Riyadh",
    forecastQuantity: 800,
    historicalAverage: 400,
    percentageChange: 100,
    anomalyScore: 0.95,
    anomalyType: "sudden_increase",
    unit: "Kits",
    detectedDate: "2023-05-16",
    impact: "critical",
  },
  {
    id: "6",
    productId: "SUP-045",
    name: "Disposable Gowns",
    category: "Medical Supplies",
    provider: "King Abdullah Medical City",
    region: "Makkah",
    forecastQuantity: 1500,
    historicalAverage: 2200,
    percentageChange: -31.8,
    anomalyScore: 0.7,
    anomalyType: "sudden_decrease",
    unit: "Boxes",
    detectedDate: "2023-05-12",
    impact: "medium",
  },
  {
    id: "7",
    productId: "MED-078",
    name: "Antibacterial Solution",
    category: "Medications",
    provider: "Asir Central Hospital",
    region: "Asir",
    forecastQuantity: 350,
    historicalAverage: 180,
    percentageChange: 94.4,
    anomalyScore: 0.88,
    anomalyType: "sudden_increase",
    unit: "Bottles",
    detectedDate: "2023-05-15",
    impact: "high",
  },
  {
    id: "8",
    productId: "SUP-112",
    name: "Examination Gloves",
    category: "Medical Supplies",
    provider: "King Fahad Central Hospital",
    region: "Jazan",
    forecastQuantity: 900,
    historicalAverage: 1600,
    percentageChange: -43.8,
    anomalyScore: 0.78,
    anomalyType: "sudden_decrease",
    unit: "Boxes",
    detectedDate: "2023-05-14",
    impact: "medium",
  },
]

// Sample data for trend chart
const trendData = [
  { month: "Jan", anomalies: 12, critical: 2, high: 5, medium: 3, low: 2 },
  { month: "Feb", anomalies: 15, critical: 3, high: 6, medium: 4, low: 2 },
  { month: "Mar", anomalies: 18, critical: 4, high: 7, medium: 5, low: 2 },
  { month: "Apr", anomalies: 14, critical: 2, high: 5, medium: 4, low: 3 },
  { month: "May", anomalies: 21, critical: 5, high: 8, medium: 6, low: 2 },
  { month: "Jun", anomalies: 25, critical: 6, high: 10, medium: 7, low: 2 },
  { month: "Jul", anomalies: 22, critical: 5, high: 9, medium: 6, low: 2 },
  { month: "Aug", anomalies: 18, critical: 4, high: 7, medium: 5, low: 2 },
  { month: "Sep", anomalies: 20, critical: 4, high: 8, medium: 6, low: 2 },
  { month: "Oct", anomalies: 28, critical: 7, high: 11, medium: 8, low: 2 },
]

// Sample data for category distribution
const categoryData = [
  { category: "Medications", count: 12, percentage: 42.9 },
  { category: "Medical Supplies", count: 8, percentage: 28.6 },
  { category: "Equipment", count: 4, percentage: 14.3 },
  { category: "Laboratory", count: 3, percentage: 10.7 },
  { category: "Surgical", count: 1, percentage: 3.6 },
]

// Sample data for product timeline
const productTimelineData = [
  { month: "Jan", forecast: 800, actual: 820 },
  { month: "Feb", forecast: 850, actual: 840 },
  { month: "Mar", forecast: 900, actual: 880 },
  { month: "Apr", forecast: 950, actual: 930 },
  { month: "May", forecast: 1200, actual: 800 }, // Anomaly point
  { month: "Jun", forecast: 1000, actual: null }, // Future forecast
  { month: "Jul", forecast: 1050, actual: null }, // Future forecast
  { month: "Aug", forecast: 1100, actual: null }, // Future forecast
]

export function AnomalyDetection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [anomalyTypeFilter, setAnomalyTypeFilter] = useState<string>("all")
  const [impactFilter, setImpactFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof sampleAnomalies)[0]
    direction: "ascending" | "descending"
  }>({ key: "anomalyScore", direction: "descending" })

  // Filter anomalies based on search term and filters
  const filteredAnomalies = sampleAnomalies.filter((anomaly) => {
    const matchesSearch =
      anomaly.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.provider.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || anomaly.category === categoryFilter
    const matchesAnomalyType = anomalyTypeFilter === "all" || anomaly.anomalyType === anomalyTypeFilter
    const matchesImpact = impactFilter === "all" || anomaly.impact === impactFilter
    const matchesRegion = regionFilter === "all" || anomaly.region === regionFilter

    return matchesSearch && matchesCategory && matchesAnomalyType && matchesImpact && matchesRegion
  })

  // Sort anomalies based on sort config
  const sortedAnomalies = [...filteredAnomalies].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: keyof (typeof sampleAnomalies)[0]) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getAnomalyBadge = (score: number) => {
    if (score >= 0.9) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Critical
        </Badge>
      )
    } else if (score >= 0.7) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          High
        </Badge>
      )
    } else if (score >= 0.5) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Medium
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Low
        </Badge>
      )
    }
  }

  const getPercentageChangeBadge = (change: number) => {
    if (change > 50) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          +{change.toFixed(1)}%
        </Badge>
      )
    } else if (change > 20) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          +{change.toFixed(1)}%
        </Badge>
      )
    } else if (change > 0) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          +{change.toFixed(1)}%
        </Badge>
      )
    } else if (change > -20) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {change.toFixed(1)}%
        </Badge>
      )
    } else if (change > -50) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {change.toFixed(1)}%
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          {change.toFixed(1)}%
        </Badge>
      )
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Unknown
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="anomalies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Anomalies</div>
                    <div className="text-2xl font-bold mt-1">{sampleAnomalies.length}</div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Critical Impact</div>
                    <div className="text-2xl font-bold mt-1">
                      {sampleAnomalies.filter((a) => a.impact === "critical").length}
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Sudden Increases</div>
                    <div className="text-2xl font-bold mt-1">
                      {sampleAnomalies.filter((a) => a.anomalyType === "sudden_increase").length}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Sudden Decreases</div>
                    <div className="text-2xl font-bold mt-1">
                      {sampleAnomalies.filter((a) => a.anomalyType === "sudden_decrease").length}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500 rotate-180" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection Filters</CardTitle>
              <CardDescription>Filter anomalies by various criteria to focus on specific issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products or providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Medications">Medications</SelectItem>
                    <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={anomalyTypeFilter} onValueChange={setAnomalyTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Anomaly Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sudden_increase">Sudden Increase</SelectItem>
                    <SelectItem value="sudden_decrease">Sudden Decrease</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={impactFilter} onValueChange={setImpactFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Impacts</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Riyadh">Riyadh</SelectItem>
                    <SelectItem value="Jeddah">Jeddah</SelectItem>
                    <SelectItem value="Makkah">Makkah</SelectItem>
                    <SelectItem value="Asir">Asir</SelectItem>
                    <SelectItem value="Jazan">Jazan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>
                {filteredAnomalies.length} anomalies detected based on your current filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("name")}>
                          Product
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("provider")}>
                          Provider
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => requestSort("forecastQuantity")}>
                          Forecast
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => requestSort("historicalAverage")}>
                          Historical
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => requestSort("percentageChange")}>
                          Change
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort("impact")}>
                          Impact
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAnomalies.length > 0 ? (
                      sortedAnomalies.map((anomaly) => (
                        <TableRow key={anomaly.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-muted-foreground mr-2" />
                              <div>
                                <div>{anomaly.name}</div>
                                <div className="text-xs text-muted-foreground">{anomaly.productId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{anomaly.provider}</div>
                            <div className="text-xs text-muted-foreground">{anomaly.region}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            {anomaly.forecastQuantity.toLocaleString()} {anomaly.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {anomaly.historicalAverage.toLocaleString()} {anomaly.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {getPercentageChangeBadge(anomaly.percentageChange)}
                          </TableCell>
                          <TableCell>{getImpactBadge(anomaly.impact)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No anomalies found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
