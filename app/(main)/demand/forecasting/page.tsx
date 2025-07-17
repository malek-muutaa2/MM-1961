"use client"

import { useState } from "react"
import {
  Download,
  ExternalLink,
  FileText,
  Hospital,
  MoreHorizontal,
  Package,
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

// Mock data for forecasting with Canadian hospital names
const forecastData = [
  {
    id: 1,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 15000,
    forecastedDemand: 16200,
    confidence: 92,
    trend: "up",
    hospital: "Toronto General Hospital",
    monthlyForecast: [15200, 15400, 15700, 16000, 16200, 16500],
  },
  {
    id: 2,
    name: "Nitrile Gloves",
    category: "PPE",
    currentDemand: 25000,
    forecastedDemand: 24000,
    confidence: 88,
    trend: "down",
    hospital: "Toronto General Hospital",
    monthlyForecast: [24800, 24600, 24400, 24200, 24000, 23800],
  },
  {
    id: 3,
    name: "Ventilators",
    category: "Equipment",
    currentDemand: 120,
    forecastedDemand: 135,
    confidence: 85,
    trend: "up",
    hospital: "Toronto General Hospital",
    monthlyForecast: [122, 125, 128, 130, 133, 135],
  },
  {
    id: 4,
    name: "IV Solutions",
    category: "Consumables",
    currentDemand: 8500,
    forecastedDemand: 8800,
    confidence: 94,
    trend: "up",
    hospital: "Toronto General Hospital",
    monthlyForecast: [8550, 8600, 8650, 8700, 8750, 8800],
  },
  {
    id: 5,
    name: "Antibiotics",
    category: "Pharmaceuticals",
    currentDemand: 4200,
    forecastedDemand: 4000,
    confidence: 90,
    trend: "down",
    hospital: "Toronto General Hospital",
    monthlyForecast: [4150, 4100, 4080, 4050, 4020, 4000],
  },
  {
    id: 6,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 8000,
    forecastedDemand: 8500,
    confidence: 91,
    trend: "up",
    hospital: "SickKids Hospital",
    monthlyForecast: [8100, 8200, 8300, 8400, 8450, 8500],
  },
  {
    id: 7,
    name: "Nitrile Gloves",
    category: "PPE",
    currentDemand: 12000,
    forecastedDemand: 11500,
    confidence: 87,
    trend: "down",
    hospital: "SickKids Hospital",
    monthlyForecast: [11900, 11800, 11700, 11600, 11550, 11500],
  },
  {
    id: 8,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 12000,
    forecastedDemand: 13200,
    confidence: 89,
    trend: "up",
    hospital: "Sunnybrook Health Sciences Centre",
    monthlyForecast: [12200, 12400, 12600, 12800, 13000, 13200],
  },
  {
    id: 9,
    name: "IV Solutions",
    category: "Consumables",
    currentDemand: 7500,
    forecastedDemand: 7800,
    confidence: 93,
    trend: "up",
    hospital: "Sunnybrook Health Sciences Centre",
    monthlyForecast: [7550, 7600, 7650, 7700, 7750, 7800],
  },
  {
    id: 10,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 9500,
    forecastedDemand: 10200,
    confidence: 90,
    trend: "up",
    hospital: "Vancouver General Hospital",
    monthlyForecast: [9600, 9700, 9850, 10000, 10100, 10200],
  },
  {
    id: 11,
    name: "Antibiotics",
    category: "Pharmaceuticals",
    currentDemand: 3800,
    forecastedDemand: 3600,
    confidence: 88,
    trend: "down",
    hospital: "Vancouver General Hospital",
    monthlyForecast: [3750, 3720, 3680, 3650, 3620, 3600],
  },
  {
    id: 12,
    name: "IV Solutions",
    category: "Consumables",
    currentDemand: 7200,
    forecastedDemand: 7000,
    confidence: 92,
    trend: "down",
    hospital: "Montreal General Hospital",
    monthlyForecast: [7150, 7120, 7080, 7050, 7020, 7000],
  },
  {
    id: 13,
    name: "Nitrile Gloves",
    category: "PPE",
    currentDemand: 18000,
    forecastedDemand: 19200,
    confidence: 86,
    trend: "up",
    hospital: "Montreal General Hospital",
    monthlyForecast: [18200, 18400, 18600, 18800, 19000, 19200],
  },
  {
    id: 14,
    name: "Surgical Masks",
    category: "PPE",
    currentDemand: 7500,
    forecastedDemand: 8000,
    confidence: 90,
    trend: "up",
    hospital: "St. Michael's Hospital",
    monthlyForecast: [7600, 7700, 7800, 7900, 7950, 8000],
  },
  {
    id: 15,
    name: "Ventilators",
    category: "Equipment",
    currentDemand: 80,
    forecastedDemand: 85,
    confidence: 84,
    trend: "up",
    hospital: "St. Michael's Hospital",
    monthlyForecast: [81, 82, 83, 84, 85, 85],
  },
]

// Mock data for seasonal trends
const seasonalTrends = [
  { season: "Winter", products: ["Antibiotics", "Flu Vaccines", "Respiratory Equipment"], trend: "up" },
  { season: "Spring", products: ["Allergy Medications", "Surgical Masks"], trend: "up" },
  { season: "Summer", products: ["IV Solutions", "Wound Care"], trend: "up" },
  { season: "Fall", products: ["Flu Vaccines", "Respiratory Equipment"], trend: "up" },
]

// Mock data for anomalies
const anomalies = [
  { product: "Surgical Masks", hospital: "Toronto General Hospital", expected: 15000, actual: 18000, deviation: 20 },
  { product: "Antibiotics", hospital: "SickKids Hospital", expected: 2100, actual: 1700, deviation: -19 },
  { product: "Ventilators", hospital: "Sunnybrook Health Sciences Centre", expected: 90, actual: 110, deviation: 22 },
]

export default function ForecastingPage() {
  const [viewMode, setViewMode] = useState<"aggregated" | "byHospital">("aggregated")
  const [selectedHospital, setSelectedHospital] = useState<string>("all")
  const [forecastPeriod, setForecastPeriod] = useState<string>("6months")
  const router = useRouter()

  // Filter products based on selected hospital
  const filteredForecasts =
    viewMode === "aggregated"
      ? forecastData
      : selectedHospital === "all"
        ? forecastData
        : forecastData.filter((product) => product.hospital === selectedHospital)

  // Get unique hospitals
  const hospitals = Array.from(new Set(forecastData.map((product) => product.hospital)))

  // Handle navigation to product details
  const handleViewDetails = (productId: number) => {
    router.push(`/demand/products/${productId}`)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Demand Forecasting</h1>
          <p className="text-muted-foreground">Predict future product demand with AI-powered forecasting</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Forecast Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Next 3 Months</SelectItem>
              <SelectItem value="6months">Next 6 Months</SelectItem>
              <SelectItem value="12months">Next 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Forecasted Demand</CardTitle>
            <CardDescription>Next 6 months total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">165,135</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-500">↑ 8.2%</span> from current period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Forecast Accuracy</CardTitle>
            <CardDescription>Average confidence level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89.6%</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-green-500">↑ 2.3%</span> from previous forecast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Demand Anomalies</CardTitle>
            <CardDescription>Detected this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">
              <span className="text-amber-500">↔ No change</span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>Demand Forecast Trends</CardTitle>
                <CardDescription>Projected demand for the next 6 months</CardDescription>
              </div>
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
                        <SelectItem key={crypto.randomUUID()} value={hospital}>
                          {hospital}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-2 font-medium">
                <div className="col-span-3">Product</div>
                <div className="col-span-2 text-center">Current</div>
                <div className="col-span-2 text-center">Forecasted</div>
                <div className="col-span-2 text-center">Change</div>
                <div className="col-span-2 text-center">Confidence</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
              <div className="divide-y">
                {filteredForecasts.map((forecast) => (
                  <div key={forecast.id} className="grid grid-cols-12 p-2">
                    <div className="col-span-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{forecast.name}</span>
                      {viewMode === "byHospital" && selectedHospital === "all" && (
                        <Badge variant="outline" className="ml-2">
                          <Hospital className="mr-1 h-3 w-3" />
                          {forecast.hospital}
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-2 text-center">{forecast.currentDemand.toLocaleString()}</div>
                    <div className="col-span-2 text-center font-medium">
                      {forecast.forecastedDemand.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-center">
                      <Badge variant={forecast.trend === "up" ? "default" : "destructive"}>
                        {forecast.trend === "up" ? "↑" : "↓"}{" "}
                        {Math.abs(
                          ((forecast.forecastedDemand - forecast.currentDemand) / forecast.currentDemand) * 100,
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                    <div className="col-span-2 text-center">
                      <Badge
                        variant="outline"
                        className={
                          forecast.confidence >= 90
                            ? "bg-green-50 text-green-700 border-green-200"
                            : forecast.confidence >= 80
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {forecast.confidence}%
                      </Badge>
                    </div>
                    <div className="col-span-1 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(forecast.id)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Product & Forecast Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Forecast Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seasonal Trends</CardTitle>
            <CardDescription>Expected seasonal demand patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seasonalTrends.map((season, index) => (
                <div key={crypto.randomUUID()} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{season.season}</span>
                    <Badge variant={season.trend === "up" ? "default" : "destructive"}>
                      {season.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{season.products.join(", ")}</div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Configure Seasonal Models
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demand Anomalies</CardTitle>
          <CardDescription>Significant deviations from expected demand patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 border-b bg-muted/50 p-2 font-medium">
              <div className="col-span-1">Product</div>
              <div className="col-span-1">Hospital</div>
              <div className="col-span-1 text-center">Expected</div>
              <div className="col-span-1 text-center">Actual</div>
              <div className="col-span-1 text-center">Deviation</div>
            </div>
            <div className="divide-y">
              {anomalies.map((anomaly, index) => (
                <div key={crypto.randomUUID()} className="grid grid-cols-5 p-2">
                  <div className="col-span-1 flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{anomaly.product}</span>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <Hospital className="h-4 w-4 text-muted-foreground" />
                      <span>{anomaly.hospital}</span>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">{anomaly.expected.toLocaleString()}</div>
                  <div className="col-span-1 text-center font-medium">{anomaly.actual.toLocaleString()}</div>
                  <div className="col-span-1 text-center">
                    <Badge variant={anomaly.deviation > 0 ? "default" : "destructive"}>
                      {anomaly.deviation > 0 ? "↑" : "↓"} {Math.abs(anomaly.deviation)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View All Anomalies</Button>
          <Button variant="default">Adjust Anomaly Detection Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
