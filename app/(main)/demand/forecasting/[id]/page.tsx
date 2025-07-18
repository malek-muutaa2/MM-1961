"use client"

import {ArrowLeft, Calendar, Download, Hospital, Package, Printer, RefreshCw} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Link from "next/link"
import {useParams} from "next/navigation"

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
        description: "Disposable face masks used during surgical procedures",
        sku: "PPE-SM-001",
        supplier: "MedSupply Canada",
        lastUpdated: "2023-04-15",
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
        description: "Disposable examination gloves made from synthetic rubber",
        sku: "PPE-NG-002",
        supplier: "SafetyFirst Medical",
        lastUpdated: "2023-04-14",
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
        description: "Medical device for artificial respiration",
        sku: "EQ-VT-003",
        supplier: "MedTech Solutions",
        lastUpdated: "2023-04-12",
    },
]

// Mock hospital data
const hospitalData = [
    {
        name: "Toronto General Hospital",
        demand: 16200,
        trend: "up",
        confidence: 92,
    },
    {
        name: "SickKids Hospital",
        demand: 8500,
        trend: "up",
        confidence: 91,
    },
    {
        name: "Sunnybrook Health Sciences Centre",
        demand: 13200,
        trend: "up",
        confidence: 89,
    },
    {
        name: "Vancouver General Hospital",
        demand: 10200,
        trend: "up",
        confidence: 90,
    },
    {
        name: "Montreal General Hospital",
        demand: 0,
        trend: "neutral",
        confidence: 0,
    },
    {
        name: "St. Michael's Hospital",
        demand: 8000,
        trend: "up",
        confidence: 90,
    },
]

// Mock monthly forecast data
const monthlyForecastData = [
    {month: "May", forecast: 15200, actual: 15300, variance: 100},
    {month: "June", forecast: 15400, actual: 15450, variance: 50},
    {month: "July", forecast: 15700, actual: null, variance: null},
    {month: "August", forecast: 16000, actual: null, variance: null},
    {month: "September", forecast: 16200, actual: null, variance: null},
    {month: "October", forecast: 16500, actual: null, variance: null},
]


const getHospitalBadgeVariant = (confidence: number) => {
    if (confidence >= 90) return "bg-green-50 text-green-700 border-green-200"
    if (confidence >= 80) return "bg-blue-50 text-blue-700 border-blue-200"
    return "bg-amber-50 text-amber-700 border-amber-200"
}


export default function ForecastDetailPage() {
    const params = useParams()
    const productId = Number(params.id)

    // Find the product data
    const product = forecastData.find((p) => p.id === productId) || forecastData[0]

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/demand/forecasting">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Forecasts
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4"/>
                        Print
                    </Button>
                    <Button variant="default" size="sm">
                        <Download className="mr-2 h-4 w-4"/>
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name} Forecast</h1>
                        <p className="text-muted-foreground">
                            Detailed forecast analysis for {product.name} ({product.sku})
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Badge variant="outline" className="text-sm py-1">
                        Category: {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1">
                        Supplier: {product.supplier}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1">
                        Last Updated: {product.lastUpdated}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Current Demand</CardTitle>
                        <CardDescription>Monthly average</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{product.currentDemand.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">Based on last 3 months of data</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Forecasted Demand</CardTitle>
                        <CardDescription>6-month projection</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{product.forecastedDemand.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">
              <span className={product.trend === "up" ? "text-green-500" : "text-red-500"}>
                {product.trend === "up" ? "↑" : "↓"}{" "}
                  {Math.abs(((product.forecastedDemand - product.currentDemand) / product.currentDemand) * 100).toFixed(
                      1,
                  )}
                  %
              </span>{" "}
                            from current demand
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Forecast Confidence</CardTitle>
                        <CardDescription>Model accuracy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{product.confidence}%</div>
                        <p className="text-sm text-muted-foreground">Based on historical forecast accuracy</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="forecast" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="forecast">Forecast Trends</TabsTrigger>
                    <TabsTrigger value="hospitals">Hospital Breakdown</TabsTrigger>
                    <TabsTrigger value="accuracy">Forecast Accuracy</TabsTrigger>
                </TabsList>
                <TabsContent value="forecast" className="mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <CardTitle>Monthly Forecast Trends</CardTitle>
                                    <CardDescription>Projected demand for the next 6 months</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select defaultValue="6months">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Forecast Period"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3months">Next 3 Months</SelectItem>
                                            <SelectItem value="6months">Next 6 Months</SelectItem>
                                            <SelectItem value="12months">Next 12 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-4 border-b bg-muted/50 p-2 font-medium">
                                    <div className="col-span-1">Month</div>
                                    <div className="col-span-1 text-center">Forecast</div>
                                    <div className="col-span-1 text-center">Actual</div>
                                    <div className="col-span-1 text-center">Variance</div>
                                </div>
                                <div className="divide-y">
                                    {monthlyForecastData.map((month) => (
                                        <div key={month.month} className="grid grid-cols-4 p-2">
                                            <div className="col-span-1 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                <span>{month.month}</span>
                                            </div>
                                            <div
                                                className="col-span-1 text-center">{month.forecast.toLocaleString()}</div>
                                            <div
                                                className="col-span-1 text-center">{month.actual ? month.actual.toLocaleString() : "—"}</div>
                                            <div className="col-span-1 text-center">
                                                {month.variance !== null ? (
                                                    <Badge variant={month.variance >= 0 ? "default" : "destructive"}>
                                                        {month.variance >= 0 ? "+" : ""}
                                                        {month.variance.toLocaleString()}
                                                    </Badge>
                                                ) : (
                                                    "—"
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="hospitals" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hospital Demand Breakdown</CardTitle>
                            <CardDescription>Forecasted demand by hospital</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="grid grid-cols-3 border-b bg-muted/50 p-2 font-medium">
                                    <div className="col-span-1">Hospital</div>
                                    <div className="col-span-1 text-center">Forecasted Demand</div>
                                    <div className="col-span-1 text-center">Confidence</div>
                                </div>
                                <div className="divide-y">
                                    {hospitalData.map((hospital) => (
                                        <div key={hospital.name} className="grid grid-cols-3 p-2">
                                            <div className="col-span-1 flex items-center gap-2">
                                                <Hospital className="h-4 w-4 text-muted-foreground"/>
                                                <span>{hospital.name}</span>
                                            </div>
                                            <div className="col-span-1 text-center">
                                                {hospital.demand > 0 ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        {hospital.demand.toLocaleString()}
                                                        <Badge
                                                            variant={hospital.trend === "up" ? "default" : "destructive"}
                                                            className="ml-2">
                                                            {(() => {
                                                                if (hospital.trend === "up") return "↑";
                                                                if (hospital.trend === "down") return "↓";
                                                                return "—";
                                                            })()}
                                                        </Badge>
                                                    </div>
                                                ) : (
                                                    "No data"
                                                )}
                                            </div>
                                            <div className="col-span-1 text-center">
                                                {hospital.confidence > 0 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className={getHospitalBadgeVariant(hospital.confidence)}
                                                    >
                                                        {hospital.confidence}%
                                                    </Badge>
                                                ) : (
                                                    "—"
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="accuracy" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Forecast Accuracy Analysis</CardTitle>
                            <CardDescription>Historical accuracy of demand forecasts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Accuracy Metrics</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span>Mean Absolute Error (MAE)</span>
                                                <span className="font-medium">312 units</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Mean Absolute Percentage Error (MAPE)</span>
                                                <span className="font-medium">2.1%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Root Mean Square Error (RMSE)</span>
                                                <span className="font-medium">387 units</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Forecast Bias</span>
                                                <span className="font-medium">+1.2%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Accuracy Improvement</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span>Last 3 months</span>
                                                <span className="font-medium text-green-600">+3.5%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Last 6 months</span>
                                                <span className="font-medium text-green-600">+5.2%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Last 12 months</span>
                                                <span className="font-medium text-green-600">+8.7%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-2">Accuracy Factors</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Seasonal demand patterns are well-captured by the model</li>
                                        <li>Supply chain disruptions have been accurately predicted</li>
                                        <li>Model performs better for high-volume products</li>
                                        <li>Accuracy is higher for short-term forecasts (1-3 months)</li>
                                        <li>External factors like public health emergencies can reduce accuracy</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
