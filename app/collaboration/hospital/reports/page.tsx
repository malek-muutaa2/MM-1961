import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  BarChart4,
  Download,
  Filter,
  Calendar,
  TrendingDown,
  TrendingUp,
  Building,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export default function UsageReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usage Reports</h2>
          <p className="text-muted-foreground">Track and analyze your medical supply usage across providers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex items-center space-x-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="medtronic">Medtronic</SelectItem>
              <SelectItem value="jnj">Johnson & Johnson</SelectItem>
              <SelectItem value="bd">BD</SelectItem>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Product Usage</TabsTrigger>
          <TabsTrigger value="providers">By Provider</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="trends">Usage Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <BarChart4 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18,392 units</div>
                <p className="text-xs text-muted-foreground">+8.2% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supply Cost</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$342,876</div>
                <p className="text-xs text-muted-foreground">-3.1% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">No change from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reporting Period</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30 days</div>
                <p className="text-xs text-muted-foreground">Apr 15 - May 15, 2023</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Daily supply usage over the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [Usage Trend Chart]
                  <p className="text-sm mt-2">Line chart showing usage trends over time</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Top Products by Usage</CardTitle>
                <CardDescription>Most frequently used products</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Surgical Masks</TableCell>
                      <TableCell>3,245 units</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          18%
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nitrile Gloves (M)</TableCell>
                      <TableCell>2,890 boxes</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          12%
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">IV Catheters 18G</TableCell>
                      <TableCell>2,450 units</TableCell>
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Usage by Provider</CardTitle>
                <CardDescription>Supply usage distribution across providers</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [Provider Distribution Chart]
                  <p className="text-sm mt-2">Pie chart showing usage by provider</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Department</CardTitle>
                <CardDescription>Supply usage across hospital departments</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [Department Distribution Chart]
                  <p className="text-sm mt-2">Bar chart showing usage by department</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Usage Details</CardTitle>
              <CardDescription>Detailed usage statistics by product</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Usage (30 Days)</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Surgical Masks</TableCell>
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>3,245 units</TableCell>
                    <TableCell>$3,245.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>18%</span>
                      </div>
                    </TableCell>
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
                    <TableCell>Medtronic</TableCell>
                    <TableCell>2,890 boxes</TableCell>
                    <TableCell>$14,450.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>12%</span>
                      </div>
                    </TableCell>
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
                    <TableCell className="font-medium">IV Catheters 18G</TableCell>
                    <TableCell>BD</TableCell>
                    <TableCell>2,450 units</TableCell>
                    <TableCell>$4,900.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        <span>5%</span>
                      </div>
                    </TableCell>
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
                    <TableCell className="font-medium">Syringes 10ml</TableCell>
                    <TableCell>BD</TableCell>
                    <TableCell>1,980 units</TableCell>
                    <TableCell>$1,980.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>8%</span>
                      </div>
                    </TableCell>
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
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>1,750 boxes</TableCell>
                    <TableCell>$3,500.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>3%</span>
                      </div>
                    </TableCell>
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

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Provider</CardTitle>
              <CardDescription>Supply usage statistics by provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total Usage</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>YoY Change</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Medtronic</TableCell>
                    <TableCell>42 products</TableCell>
                    <TableCell>6,450 units</TableCell>
                    <TableCell>$128,450.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span>+12%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 12, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Johnson & Johnson</TableCell>
                    <TableCell>38 products</TableCell>
                    <TableCell>8,230 units</TableCell>
                    <TableCell>$145,230.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span>+8%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">BD</TableCell>
                    <TableCell>24 products</TableCell>
                    <TableCell>3,712 units</TableCell>
                    <TableCell>$69,196.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-600 mr-1" />
                        <span>-3%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 8, 2023</TableCell>
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

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Medtronic</CardTitle>
                <CardDescription>Usage breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [Medtronic Category Chart]
                  <p className="text-sm mt-2">Pie chart showing usage by category</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Johnson & Johnson</CardTitle>
                <CardDescription>Usage breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [J&J Category Chart]
                  <p className="text-sm mt-2">Pie chart showing usage by category</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>BD</CardTitle>
                <CardDescription>Usage breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center bg-slate-50">
                <div className="text-center text-muted-foreground">
                  [BD Category Chart]
                  <p className="text-sm mt-2">Pie chart showing usage by category</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage by Department</CardTitle>
              <CardDescription>Supply usage statistics by hospital department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total Usage</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>YoY Change</TableHead>
                    <TableHead>Top Product</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Emergency Department</TableCell>
                    <TableCell>86 products</TableCell>
                    <TableCell>4,250 units</TableCell>
                    <TableCell>$78,450.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>+15%</span>
                      </div>
                    </TableCell>
                    <TableCell>IV Catheters 18G</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Operating Room</TableCell>
                    <TableCell>124 products</TableCell>
                    <TableCell>3,820 units</TableCell>
                    <TableCell>$145,230.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>+8%</span>
                      </div>
                    </TableCell>
                    <TableCell>Surgical Masks</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">ICU</TableCell>
                    <TableCell>92 products</TableCell>
                    <TableCell>2,712 units</TableCell>
                    <TableCell>$69,196.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>+12%</span>
                      </div>
                    </TableCell>
                    <TableCell>Nitrile Gloves (M)</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medical/Surgical Units</TableCell>
                    <TableCell>78 products</TableCell>
                    <TableCell>4,120 units</TableCell>
                    <TableCell>$42,350.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        <span>-3%</span>
                      </div>
                    </TableCell>
                    <TableCell>Alcohol Prep Pads</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Laboratory</TableCell>
                    <TableCell>45 products</TableCell>
                    <TableCell>3,490 units</TableCell>
                    <TableCell>$27,650.00</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span>+5%</span>
                      </div>
                    </TableCell>
                    <TableCell>Syringes 10ml</TableCell>
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

          <Card>
            <CardHeader>
              <CardTitle>Department Usage Comparison</CardTitle>
              <CardDescription>Compare supply usage across departments</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex items-center justify-center bg-slate-50">
              <div className="text-center text-muted-foreground">
                [Department Comparison Chart]
                <p className="text-sm mt-2">Bar chart comparing usage across departments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends Analysis</CardTitle>
              <CardDescription>Long-term supply usage patterns and forecasts</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-slate-50">
              <div className="text-center text-muted-foreground">
                [Usage Trends Chart]
                <p className="text-sm mt-2">Line chart showing usage trends over time with forecast</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Usage Patterns</CardTitle>
              <CardDescription>Identify seasonal variations in supply usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Category</TableHead>
                    <TableHead>Peak Season</TableHead>
                    <TableHead>Low Season</TableHead>
                    <TableHead>Seasonal Variance</TableHead>
                    <TableHead>Recommended Action</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Respiratory Supplies</TableCell>
                    <TableCell>Winter (Dec-Feb)</TableCell>
                    <TableCell>Summer (Jun-Aug)</TableCell>
                    <TableCell>+45%</TableCell>
                    <TableCell>Increase winter inventory by 30%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Wound Care</TableCell>
                    <TableCell>Summer (Jun-Aug)</TableCell>
                    <TableCell>Winter (Dec-Feb)</TableCell>
                    <TableCell>+28%</TableCell>
                    <TableCell>Increase summer inventory by 20%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">IV Solutions</TableCell>
                    <TableCell>No significant seasonality</TableCell>
                    <TableCell>No significant seasonality</TableCell>
                    <TableCell>±5%</TableCell>
                    <TableCell>Maintain consistent inventory</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PPE Supplies</TableCell>
                    <TableCell>Consistent year-round</TableCell>
                    <TableCell>Consistent year-round</TableCell>
                    <TableCell>±8%</TableCell>
                    <TableCell>Monitor for unexpected spikes</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Surgical Supplies</TableCell>
                    <TableCell>Spring (Mar-May)</TableCell>
                    <TableCell>Winter Holidays (Dec)</TableCell>
                    <TableCell>+15%</TableCell>
                    <TableCell>Adjust for elective surgery schedules</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
