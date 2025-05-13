import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Plus,
  Share2,
  Truck,
  Users,
  ClipboardList,
  CalendarClock,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function CollaborativePlanningPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Collaborative Planning</h2>
          <p className="text-muted-foreground">Joint supply planning with connected hospitals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Plans (5)</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming (3)</TabsTrigger>
          <TabsTrigger value="completed">Completed (12)</TabsTrigger>
          <TabsTrigger value="templates">Plan Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Across 3 hospitals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Reviews</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next: May 18, 2023</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">From Memorial Healthcare</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Deliveries</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Next: Tomorrow, 9:00 AM</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Supply Plans</CardTitle>
              <CardDescription>Ongoing collaborative supply plans with hospitals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Next Review</TableHead>
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
                          <div>Q2 Critical Supplies</div>
                          <div className="text-xs text-muted-foreground">Created May 1, 2023</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Memorial Healthcare</TableCell>
                    <TableCell>24 products</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="h-2" />
                        <span className="text-xs font-medium">75%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 18, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>PPE Optimization</div>
                          <div className="text-xs text-muted-foreground">Created Apr 15, 2023</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>City General Hospital</TableCell>
                    <TableCell>12 products</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Review</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="h-2" />
                        <span className="text-xs font-medium">45%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 20, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>IV Solutions Supply</div>
                          <div className="text-xs text-muted-foreground">Created Apr 22, 2023</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Westside Medical Center</TableCell>
                    <TableCell>8 products</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={60} className="h-2" />
                        <span className="text-xs font-medium">60%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 25, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>Surgical Supplies</div>
                          <div className="text-xs text-muted-foreground">Created May 5, 2023</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Memorial Healthcare</TableCell>
                    <TableCell>18 products</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">At Risk</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={30} className="h-2" />
                        <span className="text-xs font-medium">30%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 19, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div>Lab Supplies</div>
                          <div className="text-xs text-muted-foreground">Created Apr 28, 2023</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>City General Hospital</TableCell>
                    <TableCell>15 products</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="h-2" />
                        <span className="text-xs font-medium">85%</span>
                      </div>
                    </TableCell>
                    <TableCell>May 21, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Review Meetings</CardTitle>
                <CardDescription>Scheduled collaborative planning sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-md">
                    <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Q2 Critical Supplies Review</div>
                      <div className="text-sm text-muted-foreground">Memorial Healthcare</div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        May 18, 2023 • 10:00 AM - 11:30 AM
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>MH</AvatarFallback>
                        </Avatar>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-md">
                    <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">PPE Optimization Discussion</div>
                      <div className="text-sm text-muted-foreground">City General Hospital</div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        May 20, 2023 • 2:00 PM - 3:00 PM
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>RB</AvatarFallback>
                        </Avatar>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-md">
                    <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Surgical Supplies Emergency Meeting</div>
                      <div className="text-sm text-muted-foreground">Memorial Healthcare</div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        May 19, 2023 • 9:00 AM - 10:00 AM
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>MH</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>+2</AvatarFallback>
                        </Avatar>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on collaborative plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm">Memorial Healthcare approved Q2 Critical Supplies plan</div>
                      <div className="text-xs text-muted-foreground">Today, 11:32 AM</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm">City General Hospital commented on PPE Optimization</div>
                      <div className="text-xs text-muted-foreground">Yesterday, 3:45 PM</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm">Westside Medical Center joined IV Solutions Supply plan</div>
                      <div className="text-xs text-muted-foreground">Yesterday, 10:20 AM</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm">Scheduled delivery for Memorial Healthcare</div>
                      <div className="text-xs text-muted-foreground">May 15, 2:12 PM</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="text-sm">Created new Lab Supplies plan with City General</div>
                      <div className="text-xs text-muted-foreground">Apr 28, 9:30 AM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Plans</CardTitle>
              <CardDescription>Plans scheduled to start in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Q3 Supply Planning</TableCell>
                    <TableCell>Memorial Healthcare</TableCell>
                    <TableCell>32 products</TableCell>
                    <TableCell>Jun 1, 2023</TableCell>
                    <TableCell>90 days</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Summer Inventory Prep</TableCell>
                    <TableCell>City General Hospital</TableCell>
                    <TableCell>18 products</TableCell>
                    <TableCell>May 25, 2023</TableCell>
                    <TableCell>45 days</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Specialty Equipment</TableCell>
                    <TableCell>Westside Medical Center</TableCell>
                    <TableCell>8 products</TableCell>
                    <TableCell>Jun 15, 2023</TableCell>
                    <TableCell>60 days</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
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
              <CardTitle>Completed Plans</CardTitle>
              <CardDescription>Historical collaborative supply plans</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Q1 Critical Supplies</TableCell>
                    <TableCell>Memorial Healthcare</TableCell>
                    <TableCell>24 products</TableCell>
                    <TableCell>Mar 31, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Winter Inventory</TableCell>
                    <TableCell>City General Hospital</TableCell>
                    <TableCell>16 products</TableCell>
                    <TableCell>Feb 28, 2023</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Good</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">Showing 2 of 12 completed plans</div>
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

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Templates</CardTitle>
              <CardDescription>Reusable collaborative planning templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Quarterly Critical Supplies</TableCell>
                    <TableCell>Standard quarterly planning for essential supplies</TableCell>
                    <TableCell>24 products</TableCell>
                    <TableCell>May 1, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PPE Planning</TableCell>
                    <TableCell>Personal protective equipment supply planning</TableCell>
                    <TableCell>12 products</TableCell>
                    <TableCell>Apr 15, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">IV Solutions</TableCell>
                    <TableCell>IV fluids and related supplies planning</TableCell>
                    <TableCell>8 products</TableCell>
                    <TableCell>Apr 22, 2023</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Use
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
