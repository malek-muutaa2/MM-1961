export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  Download,
  Filter,
  BarChart4,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Hospital,
  RefreshCw,
} from "lucide-react"

export default function SharedForecastsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shared Forecasts</h2>
          <p className="text-muted-foreground">Collaborative demand forecasts based on hospital data sharing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Forecasts
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex items-center space-x-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Forecast Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Next 30 Days</SelectItem>
              <SelectItem value="60">Next 60 Days</SelectItem>
              <SelectItem value="90">Next 90 Days</SelectItem>
              <SelectItem value="180">Next 6 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Hospital Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hospitals</SelectItem>
              <SelectItem value="teaching">Teaching Hospitals</SelectItem>
              <SelectItem value="community">Community Hospitals</SelectItem>
              <SelectItem value="specialty">Specialty Hospitals</SelectItem>
              <SelectItem value="rural">Rural Hospitals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 md:ml-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Input className="w-[250px]" placeholder="Search products..." />
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Forecast Summary</TabsTrigger>
          <TabsTrigger value="products">Product Forecasts</TabsTrigger>
          <TabsTrigger value="hospitals">By Hospital</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Forecast Demand</CardTitle>
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,892 units</div>
                <p className="text-xs text-muted-foreground">+12.5% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.4%</div>
                <p className="text-xs text-muted-foreground">+3.2% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contributing Hospitals</CardTitle>
                <Hospital className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forecast Horizon</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30 days</div>
                <p className="text-xs text-muted-foreground">Updated May 15, 2023</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Demand Forecast Trends</CardTitle>
                <CardDescription>Aggregated 30-day forecast across all hospitals</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [Forecast Trend Chart]
                  <p className="text-sm mt-2">Line chart showing forecast trends over time</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Top Products by Demand</CardTitle>
                <CardDescription>Highest forecasted demand products</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Forecast</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">IV Catheters 18G</TableCell>
                      <TableCell>3,245 units</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          18%
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Surgical Masks</TableCell>
                      <TableCell>2,890 units</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          12%
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nitrile Gloves (M)</TableCell>
                      <TableCell>2,450 boxes</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-red-600">
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                          5%
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Syringes 10ml</TableCell>
                      <TableCell>1,980 units</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          8%
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Alcohol Prep Pads</TableCell>
                      <TableCell>1,750 boxes</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          3%
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Products
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forecast Anomalies</CardTitle>
              <CardDescription>Unusual patterns detected in forecast data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Forecasted</TableHead>
                    <TableHead>Deviation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Surgical Gowns</TableCell>
                    <TableCell>Memorial Healthcare</TableCell>
                    <TableCell>450 units</TableCell>
                    <TableCell>850 units</TableCell>
                    <TableCell>
                      <div className="flex items-center text-amber-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        89%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Investigating</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ventilator Circuits</TableCell>
                    <TableCell>City General Hospital</TableCell>
                    <TableCell>120 units</TableCell>
                    <TableCell>45 units</TableCell>
                    <TableCell>
                      <div className="flex items-center text-red-600">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        62%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alert</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">IV Solution Bags</TableCell>
                    <TableCell>Westside Medical Center</TableCell>
                    <TableCell>600 units</TableCell>
                    <TableCell>920 units</TableCell>
                    <TableCell>
                      <div className="flex items-center text-amber-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        53%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View All Anomalies
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Forecasts</CardTitle>
              <CardDescription>Detailed forecasts by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>30-Day Forecast</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">IV Catheters 18G</TableCell>
                    <TableCell>IV Therapy</TableCell>
                    <TableCell>3,245 units</TableCell>
                    <TableCell>4,500 units</TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sufficient</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Surgical Masks</TableCell>
                    <TableCell>PPE</TableCell>
                    <TableCell>2,890 units</TableCell>
                    <TableCell>3,200 units</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sufficient</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nitrile Gloves (M)</TableCell>
                    <TableCell>PPE</TableCell>
                    <TableCell>2,450 boxes</TableCell>
                    <TableCell>1,800 boxes</TableCell>
                    <TableCell>89%</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Syringes 10ml</TableCell>
                    <TableCell>Injection</TableCell>
                    <TableCell>1,980 units</TableCell>
                    <TableCell>2,500 units</TableCell>
                    <TableCell>94%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sufficient</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Alcohol Prep Pads</TableCell>
                    <TableCell>Skin Prep</TableCell>
                    <TableCell>1,750 boxes</TableCell>
                    <TableCell>900 boxes</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">Showing 5 of 128 products</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Forecasts</CardTitle>
              <CardDescription>Forecast data by contributing hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>30-Day Forecast</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Memorial Healthcare</TableCell>
                    <TableCell>Teaching</TableCell>
                    <TableCell>128</TableCell>
                    <TableCell>8,450 units</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        94%
                      </div>
                    </TableCell>
                    <TableCell>Today, 9:45 AM</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">City General Hospital</TableCell>
                    <TableCell>Community</TableCell>
                    <TableCell>92</TableCell>
                    <TableCell>5,230 units</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        87%
                      </div>
                    </TableCell>
                    <TableCell>Yesterday</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Westside Medical Center</TableCell>
                    <TableCell>Specialty</TableCell>
                    <TableCell>64</TableCell>
                    <TableCell>3,120 units</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-600 mr-1" />
                        76%
                      </div>
                    </TableCell>
                    <TableCell>5 days ago</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Accuracy Analysis</CardTitle>
              <CardDescription>Comparing forecasted vs. actual demand</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-slate-50">
              <div className="text-center text-muted-foreground">
                [Forecast Accuracy Chart]
                <p className="text-sm mt-2">Chart showing forecast accuracy over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
