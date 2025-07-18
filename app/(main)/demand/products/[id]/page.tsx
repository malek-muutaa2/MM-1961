"use client"

import {ArrowLeft, Download, Package, Printer, RefreshCw, Settings, ShoppingCart} from "lucide-react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Link from "next/link"
import {useParams} from "next/navigation"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    ReferenceLine,
} from "recharts"
import {Progress} from "@/components/ui/progress"

// Mock data for product details
const productData = [
    {
        id: 1,
        name: "Surgical Masks",
        category: "PPE",
        currentStock: 32000,
        reorderPoint: 15000,
        optimalStock: 45000,
        currentDemand: 15000,
        forecastedDemand: 16200,
        confidence: 92,
        trend: "up",
        description: "Disposable face masks used during surgical procedures",
        sku: "PPE-SM-001",
        supplier: "MedSupply Canada",
        lastUpdated: "2023-04-15",
        unitPrice: 0.45,
        leadTime: "2-3 weeks",
        stockStatus: "Adequate",
        daysOfSupply: 64,
    },
    {
        id: 2,
        name: "Nitrile Gloves",
        category: "PPE",
        currentStock: 58000,
        reorderPoint: 20000,
        optimalStock: 75000,
        currentDemand: 25000,
        forecastedDemand: 24000,
        confidence: 88,
        trend: "down",
        description: "Disposable examination gloves made from synthetic rubber",
        sku: "PPE-NG-002",
        supplier: "SafetyFirst Medical",
        lastUpdated: "2023-04-14",
        unitPrice: 0.12,
        leadTime: "3-4 weeks",
        stockStatus: "Optimal",
        daysOfSupply: 72,
    },
    {
        id: 3,
        name: "Ventilators",
        category: "Equipment",
        currentStock: 180,
        reorderPoint: 50,
        optimalStock: 200,
        currentDemand: 120,
        forecastedDemand: 135,
        confidence: 85,
        trend: "up",
        description: "Medical device for artificial respiration",
        sku: "EQ-VT-003",
        supplier: "MedTech Solutions",
        lastUpdated: "2023-04-12",
        unitPrice: 12500,
        leadTime: "8-10 weeks",
        stockStatus: "Adequate",
        daysOfSupply: 45,
    },
]

// Mock data for monthly demand
const monthlyDemandData = [
    {name: "Jan", actual: 14200, forecast: 14000},
    {name: "Feb", actual: 14500, forecast: 14300},
    {name: "Mar", actual: 15000, forecast: 14800},
    {name: "Apr", actual: 15300, forecast: 15200},
    {name: "May", actual: null, forecast: 15500},
    {name: "Jun", actual: null, forecast: 15800},
    {name: "Jul", actual: null, forecast: 16000},
    {name: "Aug", actual: null, forecast: 16200},
    {name: "Sep", actual: null, forecast: 16500},
]

// Mock data for hospital demand distribution
const hospitalDemandData = [
    {name: "Toronto General Hospital", value: 16200},
    {name: "SickKids Hospital", value: 8500},
    {name: "Sunnybrook Health Sciences Centre", value: 13200},
    {name: "Vancouver General Hospital", value: 10200},
    {name: "Montreal General Hospital", value: 7000},
    {name: "St. Michael's Hospital", value: 8000},
]

// Mock data for inventory levels
const inventoryData = [
    {name: "Jan", stock: 35000, reorderPoint: 15000, optimalStock: 45000},
    {name: "Feb", stock: 32000, reorderPoint: 15000, optimalStock: 45000},
    {name: "Mar", stock: 38000, reorderPoint: 15000, optimalStock: 45000},
    {name: "Apr", stock: 32000, reorderPoint: 15000, optimalStock: 45000},
    {name: "May", stock: null, reorderPoint: 15000, optimalStock: 45000},
    {name: "Jun", stock: null, reorderPoint: 15000, optimalStock: 45000},
]

// Mock data for inventory transactions
const inventoryTransactions = [
    {date: "2023-04-15", type: "Received", quantity: 5000, balance: 32000, source: "MedSupply Canada"},
    {date: "2023-04-10", type: "Issued", quantity: -3200, balance: 27000, source: "Toronto General Hospital"},
    {date: "2023-04-05", type: "Issued", quantity: -1800, balance: 30200, source: "SickKids Hospital"},
    {date: "2023-03-28", type: "Received", quantity: 10000, balance: 32000, source: "MedSupply Canada"},
    {date: "2023-03-20", type: "Issued", quantity: -4500, balance: 22000, source: "Sunnybrook Health Sciences Centre"},
]

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function ProductDetailPage() {
    const params = useParams()
    const productId = Number(params.id)

    // Find the product data
    const product = productData.find((p) => p.id === productId) || productData[0]

    // Calculate stock level percentage
    const stockPercentage = Math.min(Math.round((product.currentStock / product.optimalStock) * 100), 100)

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
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Package className="h-8 w-8 text-primary"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-muted-foreground">
                            {product.description} ({product.sku})
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-sm py-1">
                        Category: {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1">
                        Supplier: {product.supplier}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1">
                        Last Updated: {product.lastUpdated}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1">
                        Unit Price: ${product.unitPrice.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-sm py-1">
                        Lead Time: {product.leadTime}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Current Stock</CardTitle>
                        <CardDescription>Available units</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{product.currentStock.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">
                            {product.currentStock > product.reorderPoint ? (
                                <span className="text-green-500">Above reorder point</span>
                            ) : (
                                <span className="text-red-500">Below reorder point</span>
                            )}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Current Demand</CardTitle>
                        <CardDescription>Monthly average</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{product.currentDemand.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">Based on last 3 months</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Forecasted Demand</CardTitle>
                        <CardDescription>Next 6 months</CardDescription>
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
                            from current
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Days of Supply</CardTitle>
                        <CardDescription>At current demand</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{product.daysOfSupply} days</div>
                        <p className="text-sm text-muted-foreground">
                            {product.daysOfSupply > 60 ? (
                                <span className="text-green-500">Healthy supply</span>
                            ) : ""}
                            {product.daysOfSupply > 30 ? (
                                <span className="text-amber-500">Moderate supply</span>
                            ) : (
                                <span className="text-red-500">Low supply</span>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="demand" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                </TabsList>

                <TabsContent value="demand" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <CardTitle>Demand Forecast Chart</CardTitle>
                                    <CardDescription>Historical and projected demand</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select defaultValue="6months">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Time Period"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3months">3 Months</SelectItem>
                                            <SelectItem value="6months">6 Months</SelectItem>
                                            <SelectItem value="12months">12 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyDemandData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        name="Actual Demand"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={{r: 4}}
                                        activeDot={{r: 6}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecast"
                                        name="Forecasted Demand"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Confidence: {product.confidence}%
                                </Badge>
                                <Badge variant={product.trend === "up" ? "default" : "destructive"}>
                                    {product.trend === "up" ? "Increasing" : "Decreasing"} Trend
                                </Badge>
                            </div>
                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4"/>
                                Adjust Forecast Settings
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Hospital Demand Distribution</CardTitle>
                            <CardDescription>Demand breakdown by hospital</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={hospitalDemandData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {hospitalDemandData.map((entry, index) => (
                                            <Cell key={`cell-${index + 1}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => value.toLocaleString()}/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inventory" className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Stock Level</CardTitle>
                                <CardDescription>Relative to optimal and reorder points</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Current Stock: {product.currentStock.toLocaleString()}</span>
                                        <span>Optimal: {product.optimalStock.toLocaleString()}</span>
                                    </div>
                                    <Progress value={stockPercentage} className="h-4"/>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Reorder Point: {product.reorderPoint.toLocaleString()}</span>
                                        <span>{stockPercentage}%</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-muted rounded-lg p-3 text-center">
                                            <div className="text-sm font-medium text-muted-foreground">Status</div>
                                            <div className="text-lg font-bold">{product.stockStatus}</div>
                                        </div>
                                        <div className="bg-muted rounded-lg p-3 text-center">
                                            <div className="text-sm font-medium text-muted-foreground">Days of Supply
                                            </div>
                                            <div className="text-lg font-bold">{product.daysOfSupply}</div>
                                        </div>
                                        <div className="bg-muted rounded-lg p-3 text-center">
                                            <div className="text-sm font-medium text-muted-foreground">Lead Time</div>
                                            <div className="text-lg font-bold">{product.leadTime}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button variant="outline" size="sm">
                                            <ShoppingCart className="mr-2 h-4 w-4"/>
                                            Create Order
                                        </Button>
                                        <Button variant="default" size="sm">
                                            <Settings className="mr-2 h-4 w-4"/>
                                            Adjust Stock Levels
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Inventory Transactions</CardTitle>
                                <CardDescription>Last 5 inventory movements</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-4 border-b bg-muted/50 p-2 text-sm font-medium">
                                        <div className="col-span-1">Date</div>
                                        <div className="col-span-1">Type</div>
                                        <div className="col-span-1 text-right">Quantity</div>
                                        <div className="col-span-1 text-right">Balance</div>
                                    </div>
                                    <div className="divide-y">
                                        {inventoryTransactions.map((transaction, index) => (
                                            <div key={`${index + 1}`} className="grid grid-cols-4 p-2 text-sm">
                                                <div className="col-span-1">{transaction.date}</div>
                                                <div className="col-span-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            transaction.type === "Received"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                        }
                                                    >
                                                        {transaction.type}
                                                    </Badge>
                                                </div>
                                                <div
                                                    className={`col-span-1 text-right ${
                                                        transaction.quantity > 0 ? "text-green-600" : "text-amber-600"
                                                    }`}
                                                >
                                                    {transaction.quantity > 0 ? "+" : ""}
                                                    {transaction.quantity.toLocaleString()}
                                                </div>
                                                <div
                                                    className="col-span-1 text-right">{transaction.balance.toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">
                                    View All Transactions
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory History</CardTitle>
                            <CardDescription>Historical inventory levels</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={inventoryData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <ReferenceLine y={product.reorderPoint} label="Reorder Point" stroke="red"
                                                   strokeDasharray="3 3"/>
                                    <ReferenceLine y={product.optimalStock} label="Optimal Stock" stroke="green"
                                                   strokeDasharray="3 3"/>
                                    <Area
                                        type="monotone"
                                        dataKey="stock"
                                        name="Stock Level"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>Detailed product specifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Product Name:</span>
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">SKU:</span>
                                                <span className="font-medium">{product.sku}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Category:</span>
                                                <span className="font-medium">{product.category}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Description:</span>
                                                <span className="font-medium">{product.description}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Inventory Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Current Stock:</span>
                                                <span
                                                    className="font-medium">{product.currentStock.toLocaleString()} units</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Reorder Point:</span>
                                                <span
                                                    className="font-medium">{product.reorderPoint.toLocaleString()} units</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Optimal Stock:</span>
                                                <span
                                                    className="font-medium">{product.optimalStock.toLocaleString()} units</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Supplier Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Supplier:</span>
                                                <span className="font-medium">{product.supplier}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Unit Price:</span>
                                                <span className="font-medium">${product.unitPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Lead Time:</span>
                                                <span className="font-medium">{product.leadTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Last Updated:</span>
                                                <span className="font-medium">{product.lastUpdated}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Demand Information</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Current Demand:</span>
                                                <span
                                                    className="font-medium">{product.currentDemand.toLocaleString()} units/month</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Forecasted Demand:</span>
                                                <span
                                                    className="font-medium">{product.forecastedDemand.toLocaleString()} units/month</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Forecast Confidence:</span>
                                                <span className="font-medium">{product.confidence}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Edit Product Details</Button>
                            <Button variant="default">Update Inventory</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
