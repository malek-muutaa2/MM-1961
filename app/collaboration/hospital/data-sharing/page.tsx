import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DataSharingSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Sharing Settings</h2>
          <p className="text-muted-foreground">Control what data you share with your medical supply providers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">View Sharing History</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Providers</CardTitle>
              <CardDescription>Manage data sharing settings for each connected provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="medtronic" className="space-y-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="medtronic">Medtronic</TabsTrigger>
                  <TabsTrigger value="jnj">Johnson & Johnson</TabsTrigger>
                  <TabsTrigger value="bd">BD</TabsTrigger>
                </TabsList>

                <TabsContent value="medtronic" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-md">
                    <div className="bg-white p-2 rounded-md">
                      <Building className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Medtronic</h3>
                      <p className="text-sm text-muted-foreground">Connected since Jan 15, 2023</p>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="inventory-levels" className="text-base font-medium">
                          Inventory Levels
                        </Label>
                        <Switch id="inventory-levels" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share current inventory levels for Medtronic products to improve supply chain efficiency
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="usage-data" className="text-base font-medium">
                          Usage Data
                        </Label>
                        <Switch id="usage-data" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share product usage patterns to improve demand forecasting accuracy
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="reorder-points" className="text-base font-medium">
                          Reorder Points
                        </Label>
                        <Switch id="reorder-points" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share minimum stock levels to prevent stockouts and improve delivery timing
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="procedure-forecasts" className="text-base font-medium">
                          Procedure Forecasts
                        </Label>
                        <Switch id="procedure-forecasts" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share upcoming procedure schedules to help anticipate demand spikes
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="expiration-data" className="text-base font-medium">
                          Expiration Data
                        </Label>
                        <Switch id="expiration-data" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share product expiration dates to reduce waste and improve inventory rotation
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="jnj" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-md">
                    <div className="bg-white p-2 rounded-md">
                      <Building className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Johnson & Johnson</h3>
                      <p className="text-sm text-muted-foreground">Connected since Mar 3, 2023</p>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>

                  {/* Similar settings as Medtronic but with different default values */}
                </TabsContent>

                <TabsContent value="bd" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-md">
                    <div className="bg-white p-2 rounded-md">
                      <Building className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">BD (Becton Dickinson)</h3>
                      <p className="text-sm text-muted-foreground">Connected since May 22, 2023</p>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>

                  {/* Similar settings as Medtronic but with different default values */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Access Log</CardTitle>
              <CardDescription>Recent provider access to your shared data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Access Time</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Medtronic</TableCell>
                    <TableCell>Inventory Levels</TableCell>
                    <TableCell>Today, 10:23 AM</TableCell>
                    <TableCell>Forecast Update</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Authorized</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Johnson & Johnson</TableCell>
                    <TableCell>Usage Data</TableCell>
                    <TableCell>Yesterday, 3:45 PM</TableCell>
                    <TableCell>Supply Planning</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Authorized</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">BD</TableCell>
                    <TableCell>Expiration Data</TableCell>
                    <TableCell>May 15, 2:12 PM</TableCell>
                    <TableCell>Inventory Rotation</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Authorized</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Medtronic</TableCell>
                    <TableCell>Procedure Forecasts</TableCell>
                    <TableCell>May 14, 9:30 AM</TableCell>
                    <TableCell>Demand Planning</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Denied</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View Full History
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Categories Shared</span>
                  <span className="font-medium">4 of 5</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connected Providers</span>
                  <span className="font-medium">3</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Settings Review</span>
                  <span className="font-medium">2 weeks ago</span>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full" size="sm">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Privacy Checkup
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits of Data Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Reduced Stockouts</p>
                  <p className="text-sm text-muted-foreground">32% decrease in critical supply stockouts</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Improved Forecasting</p>
                  <p className="text-sm text-muted-foreground">18% increase in forecast accuracy</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Reduced Waste</p>
                  <p className="text-sm text-muted-foreground">24% reduction in expired products</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Cost Savings</p>
                  <p className="text-sm text-muted-foreground">$125,000 annual inventory cost reduction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
