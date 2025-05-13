import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Building,
  Clock,
  FileText,
  Filter,
  PackageCheck,
  PackageX,
  Plus,
  Truck,
  AlertTriangle,
  ClipboardList,
  MoreHorizontal,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SupplyRequestsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Supply Requests</h2>
          <p className="text-muted-foreground">Request and track medical supplies from your providers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Import Order List
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 pending approval, 8 in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Next delivery: Tomorrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Value: $124,580</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Reported</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 backorder, 1 quality issue</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex items-center space-x-2">
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

          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="issue">Has Issues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 md:ml-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Input className="w-[250px]" placeholder="Search requests..." />
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Requests (12)</TabsTrigger>
          <TabsTrigger value="draft">Drafts (3)</TabsTrigger>
          <TabsTrigger value="completed">Completed (28)</TabsTrigger>
          <TabsTrigger value="issues">Issues (2)</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Supply Requests</CardTitle>
              <CardDescription>Manage your ongoing supply requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>REQ-2023-0542</div>
                          <div className="text-xs text-muted-foreground">Emergency Department</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Medtronic</TableCell>
                    <TableCell>12 items</TableCell>
                    <TableCell>$8,450.00</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Approval</Badge>
                    </TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell>May 22, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>REQ-2023-0541</div>
                          <div className="text-xs text-muted-foreground">Operating Room</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>8 items</TableCell>
                    <TableCell>$12,780.00</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
                    </TableCell>
                    <TableCell>May 14, 2023</TableCell>
                    <TableCell>May 21, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>REQ-2023-0540</div>
                          <div className="text-xs text-muted-foreground">ICU</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>BD</TableCell>
                    <TableCell>15 items</TableCell>
                    <TableCell>$9,320.00</TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>
                    </TableCell>
                    <TableCell>May 12, 2023</TableCell>
                    <TableCell>May 18, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>REQ-2023-0539</div>
                          <div className="text-xs text-muted-foreground">Laboratory</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Medtronic</TableCell>
                    <TableCell>6 items</TableCell>
                    <TableCell>$4,250.00</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Approval</Badge>
                    </TableCell>
                    <TableCell>May 11, 2023</TableCell>
                    <TableCell>May 18, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>REQ-2023-0538</div>
                          <div className="text-xs text-muted-foreground">Medical/Surgical Units</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>10 items</TableCell>
                    <TableCell>$6,780.00</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>
                    </TableCell>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell>May 17, 2023</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">Showing 5 of 12 active requests</div>
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

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>REQ-2023-0542 - Emergency Department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-medium">Medtronic</div>
                      <div className="text-sm text-muted-foreground">Medical Device Manufacturer</div>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending Approval</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Request Date</div>
                    <div className="text-sm">May 15, 2023</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Expected Delivery</div>
                    <div className="text-sm">May 22, 2023</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Department</div>
                    <div className="text-sm">Emergency Department</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Requested By</div>
                    <div className="text-sm">Dr. Sarah Johnson</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-2">Items (12)</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>IV Catheters 18G</TableCell>
                        <TableCell>200 units</TableCell>
                        <TableCell>$2.50</TableCell>
                        <TableCell>$500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Surgical Masks</TableCell>
                        <TableCell>1000 units</TableCell>
                        <TableCell>$0.75</TableCell>
                        <TableCell>$750.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Nitrile Gloves (M)</TableCell>
                        <TableCell>50 boxes</TableCell>
                        <TableCell>$12.00</TableCell>
                        <TableCell>$600.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="font-medium">$8,450.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div>
                  <div className="text-sm font-medium mb-2">Notes</div>
                  <div className="text-sm bg-slate-50 p-3 rounded-md">
                    Please expedite this order as we are running low on IV catheters. We need these supplies by the end
                    of next week at the latest.
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Edit Request</Button>
                <div className="space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Approve Request</Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Create New Request</CardTitle>
                <CardDescription>Request supplies from your providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Provider</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medtronic">Medtronic</SelectItem>
                      <SelectItem value="jnj">Johnson & Johnson</SelectItem>
                      <SelectItem value="bd">BD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Department</SelectItem>
                      <SelectItem value="or">Operating Room</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="medsurg">Medical/Surgical Units</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Delivery Date</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea placeholder="Add any special instructions or notes..." rows={3} />
                </div>

                <div className="pt-2">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Items
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <Button>Submit Request</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Requests</CardTitle>
              <CardDescription>Supply requests saved as drafts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Draft ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">DRAFT-0032</TableCell>
                    <TableCell>Medtronic</TableCell>
                    <TableCell>ICU</TableCell>
                    <TableCell>8 items</TableCell>
                    <TableCell>May 14, 2023</TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Submit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DRAFT-0031</TableCell>
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>Operating Room</TableCell>
                    <TableCell>12 items</TableCell>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell>May 12, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Submit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DRAFT-0030</TableCell>
                    <TableCell>BD</TableCell>
                    <TableCell>Laboratory</TableCell>
                    <TableCell>5 items</TableCell>
                    <TableCell>May 8, 2023</TableCell>
                    <TableCell>May 8, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Submit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Requests</CardTitle>
              <CardDescription>Successfully delivered supply requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Delivered On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">REQ-2023-0537</TableCell>
                    <TableCell>Medtronic</TableCell>
                    <TableCell>Emergency Department</TableCell>
                    <TableCell>10 items</TableCell>
                    <TableCell>$7,250.00</TableCell>
                    <TableCell>May 14, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REQ-2023-0536</TableCell>
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>Operating Room</TableCell>
                    <TableCell>15 items</TableCell>
                    <TableCell>$12,450.00</TableCell>
                    <TableCell>May 12, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REQ-2023-0535</TableCell>
                    <TableCell>BD</TableCell>
                    <TableCell>ICU</TableCell>
                    <TableCell>8 items</TableCell>
                    <TableCell>$5,780.00</TableCell>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">Showing 3 of 28 completed requests</div>
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

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requests with Issues</CardTitle>
              <CardDescription>Supply requests that require attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-100 rounded-md p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <PackageX className="h-5 w-5 text-red-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">REQ-2023-0534 - Backorder Issue</h3>
                          <p className="text-sm text-muted-foreground">Johnson & Johnson - Operating Room</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Backorder</Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>3 items are currently on backorder and will be delayed by approximately 2 weeks.</p>
                        <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                          <li>Surgical Sutures (Delayed until Jun 1)</li>
                          <li>Sterile Drapes (Delayed until May 28)</li>
                          <li>Surgical Gowns XL (Delayed until Jun 5)</li>
                        </ul>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Reported May 8, 2023
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            Contact Provider
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">REQ-2023-0532 - Quality Issue</h3>
                          <p className="text-sm text-muted-foreground">BD - Laboratory</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Quality Issue</Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Quality issues reported with the following items:</p>
                        <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                          <li>Blood Collection Tubes - 20% defect rate observed</li>
                          <li>Specimen Containers - Improper sealing reported</li>
                        </ul>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Reported May 5, 2023
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            Contact Provider
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issue Resolution History</CardTitle>
              <CardDescription>Previously resolved supply request issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">REQ-2023-0528</TableCell>
                    <TableCell>Shipping Delay</TableCell>
                    <TableCell>Medtronic</TableCell>
                    <TableCell>Apr 28, 2023</TableCell>
                    <TableCell>May 2, 2023</TableCell>
                    <TableCell>Expedited shipping provided</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REQ-2023-0525</TableCell>
                    <TableCell>Incorrect Items</TableCell>
                    <TableCell>Johnson & Johnson</TableCell>
                    <TableCell>Apr 25, 2023</TableCell>
                    <TableCell>Apr 27, 2023</TableCell>
                    <TableCell>Items replaced and rush delivered</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">REQ-2023-0520</TableCell>
                    <TableCell>Quantity Shortage</TableCell>
                    <TableCell>BD</TableCell>
                    <TableCell>Apr 20, 2023</TableCell>
                    <TableCell>Apr 22, 2023</TableCell>
                    <TableCell>Missing items shipped with discount</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
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
