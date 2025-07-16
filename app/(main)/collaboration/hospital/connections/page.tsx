"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  AlertCircle,
  X,
  Eye,
  Settings,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"

// Provider data - Updated for Abu Dhabi
const providers = [
  {
    id: 1,
    name: "Rafed",
    type: "Medical Supply Chain Platform",
    location: "Abu Dhabi, UAE",
    phone: "+971 2 555 1234",
    email: "healthcare@rafed.ae",
    status: "active",
    sharedCategories: 4,
    totalCategories: 5,
    lastSync: "Today, 9:45 AM",
    products: 128,
    privacyLevel: "High",
    contactPerson: "Ahmed Al Hashemi",
    contactRole: "Account Manager",
    joinDate: "Jan 15, 2023",
  },
  {
    id: 2,
    name: "Julphar",
    type: "Pharmaceuticals",
    location: "Ras Al Khaimah, UAE",
    phone: "+971 7 246 6666",
    email: "hospital.support@julphar.ae",
    status: "active",
    sharedCategories: 3,
    totalCategories: 5,
    lastSync: "Yesterday",
    products: 92,
    privacyLevel: "High",
    contactPerson: "Mohammed Al Zaabi",
    contactRole: "Healthcare Relations",
    joinDate: "Mar 3, 2023",
  },
  {
    id: 3,
    name: "Gulf Drug",
    type: "Medical Supplies Distributor",
    location: "Dubai, UAE",
    phone: "+971 4 555 4321",
    email: "hospital.relations@gulfdrug.ae",
    status: "review",
    sharedCategories: 2,
    totalCategories: 5,
    lastSync: "5 days ago",
    products: 64,
    privacyLevel: "Review",
    contactPerson: "Khalid Al Marzooqi",
    contactRole: "Supply Chain Specialist",
    joinDate: "Feb 20, 2023",
  },
  {
    id: 4,
    name: "Abu Dhabi Medical Devices",
    type: "Medical Devices",
    location: "Abu Dhabi, UAE",
    phone: "+971 2 555 8765",
    email: "hospital.support@admd.ae",
    status: "pending",
    requestDate: "2 days ago",
    contactPerson: "Fatima Al Shamsi",
    contactRole: "Regional Manager",
  },
  {
    id: 5,
    name: "Life Pharma",
    type: "Pharmaceuticals",
    location: "Abu Dhabi, UAE",
    phone: "+971 2 555 9876",
    email: "hospital.accounts@lifepharma.ae",
    status: "pending",
    requestDate: "5 days ago",
    contactPerson: "Saeed Al Naqbi",
    contactRole: "Healthcare Solutions",
  },
  {
    id: 6,
    name: "Medtronic UAE",
    type: "Medical Technology",
    location: "Dubai, UAE",
    phone: "+971 4 555 2345",
    email: "hospital.relations@medtronic.ae",
    status: "active",
    sharedCategories: 5,
    totalCategories: 5,
    lastSync: "Today, 11:30 AM",
    products: 76,
    privacyLevel: "High",
    contactPerson: "Aisha Al Suwaidi",
    contactRole: "Account Executive",
    joinDate: "Apr 10, 2023",
  },
]

export default function ProviderConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [dataManagementOpen, setDataManagementOpen] = useState(false)

  const activeProviders = providers.filter((p) => p.status === "active")
  const pendingProviders = providers.filter((p) => p.status === "pending")
  const allProviders = providers

  const filteredActive = activeProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPending = pendingProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAll = allProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewDetails = (provider: any) => {
    setSelectedProvider(provider)
    setDetailsOpen(true)
  }

  const handleManageData = (provider:any) => {
    setSelectedProvider(provider)
    setDataManagementOpen(true)
  }

  const renderProviderCard = (provider: any) => (
    <Card key={provider.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-md">
              <Building className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <CardTitle>{provider.name}</CardTitle>
              <CardDescription>{provider.type}</CardDescription>
            </div>
          </div>
          {provider.status === "active" && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
          )}
          {provider.status === "review" && (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Review</Badge>
          )}
          {provider.status === "pending" && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{provider.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{provider.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{provider.email}</span>
          </div>
        </div>

        {provider.status !== "pending" && (
          <div className="mt-4 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Shared Data Categories</span>
                <span className="font-medium">
                  {provider.sharedCategories} of {provider.totalCategories}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Last Sync</span>
                <span className={`font-medium ${provider.status === "review" ? "text-amber-600" : ""}`}>
                  {provider.lastSync}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Products</span>
                <span className="font-medium">{provider.products}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Data Privacy</span>
                <div className="flex items-center">
                  {provider.privacyLevel === "High" ? (
                    <ShieldCheck className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-amber-600 mr-1" />
                  )}
                  <span className="font-medium">{provider.privacyLevel}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {provider.status === "pending" && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Requested {provider.requestDate}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(provider)}>
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
        {provider.status !== "pending" && (
          <Button size="sm" onClick={() => handleManageData(provider)}>
            <Settings className="h-4 w-4 mr-1" />
            Manage Data
          </Button>
        )}
        {provider.status === "pending" && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
            <Button size="sm">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Accept
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Provider Connections</h2>
          <p className="text-muted-foreground">Manage your medical supply provider relationships</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search providers..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Connections ({activeProviders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests ({pendingProviders.length})</TabsTrigger>
          <TabsTrigger value="all">All Providers ({allProviders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredActive.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredActive.map(renderProviderCard)}</div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">No active providers match your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredPending.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredPending.map(renderProviderCard)}</div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">No pending requests match your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredAll.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredAll.map(renderProviderCard)}</div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">No providers match your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Provider Details Dialog */}
      {selectedProvider && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-700" />
                {selectedProvider.name}
              </DialogTitle>
              <DialogDescription>{selectedProvider.type}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">Provider Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <p className="text-sm">{selectedProvider.location}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="text-sm">{selectedProvider.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="text-sm">{selectedProvider.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div className="flex items-center">
                        {selectedProvider.status === "active" && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        )}
                        {selectedProvider.status === "review" && (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Review</Badge>
                        )}
                        {selectedProvider.status === "pending" && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Contact Person</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <p className="text-sm">{selectedProvider.contactPerson}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Role</Label>
                      <p className="text-sm">{selectedProvider.contactRole}</p>
                    </div>
                    {selectedProvider.status !== "pending" && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Join Date</Label>
                        <p className="text-sm">{selectedProvider.joinDate}</p>
                      </div>
                    )}
                    {selectedProvider.status === "pending" && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Request Date</Label>
                        <p className="text-sm">{selectedProvider.requestDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedProvider.status !== "pending" && (
                  <>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Data Sharing Status</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Shared Categories</Label>
                          <p className="text-sm">
                            {selectedProvider.sharedCategories} of {selectedProvider.totalCategories}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Last Sync</Label>
                          <p className="text-sm">{selectedProvider.lastSync}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Products</Label>
                          <p className="text-sm">{selectedProvider.products}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Privacy Level</Label>
                          <div className="flex items-center">
                            {selectedProvider.privacyLevel === "High" ? (
                              <ShieldCheck className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-amber-600 mr-1" />
                            )}
                            <span className="text-sm">{selectedProvider.privacyLevel}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Shared Data Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50">
                          Inventory Levels
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50">
                          Usage Data
                        </Badge>
                        {selectedProvider.sharedCategories >= 3 && (
                          <Badge variant="outline" className="bg-blue-50">
                            Procedure Forecasts
                          </Badge>
                        )}
                        {selectedProvider.sharedCategories >= 4 && (
                          <Badge variant="outline" className="bg-blue-50">
                            Expiration Tracking
                          </Badge>
                        )}
                        {selectedProvider.sharedCategories >= 5 && (
                          <Badge variant="outline" className="bg-blue-50">
                            Demand Forecasts
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {selectedProvider.status === "pending" && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Requested Data Access</h3>
                    <div className="space-y-2">
                      <p className="text-sm">This provider is requesting access to:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Inventory Levels</li>
                        <li>Usage Data</li>
                        <li>Reorder Points</li>
                      </ul>
                      <p className="text-sm mt-2">Purpose: Supply chain optimization and demand forecasting</p>
                      <div className="flex items-center mt-2">
                        <ShieldCheck className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm">HIPAA Compliant</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              {selectedProvider.status !== "pending" && (
                <Button
                  onClick={() => {
                    setDetailsOpen(false)
                    handleManageData(selectedProvider)
                  }}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage Data
                </Button>
              )}
              {selectedProvider.status === "pending" && (
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Data Management Dialog */}
      {selectedProvider && (
        <Dialog open={dataManagementOpen} onOpenChange={setDataManagementOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Data Sharing Settings</DialogTitle>
              <DialogDescription>Configure what data you share with {selectedProvider.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inventory">Inventory Levels</Label>
                    <p className="text-sm text-muted-foreground">Current stock levels and locations</p>
                  </div>
                  <Switch id="inventory" defaultChecked={selectedProvider.sharedCategories >= 1} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="usage">Usage Data</Label>
                    <p className="text-sm text-muted-foreground">Historical product consumption rates</p>
                  </div>
                  <Switch id="usage" defaultChecked={selectedProvider.sharedCategories >= 2} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="procedures">Procedure Forecasts</Label>
                    <p className="text-sm text-muted-foreground">Upcoming scheduled procedures</p>
                  </div>
                  <Switch id="procedures" defaultChecked={selectedProvider.sharedCategories >= 3} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="expiration">Expiration Tracking</Label>
                    <p className="text-sm text-muted-foreground">Product expiration dates and alerts</p>
                  </div>
                  <Switch id="expiration" defaultChecked={selectedProvider.sharedCategories >= 4} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="forecasts">Demand Forecasts</Label>
                    <p className="text-sm text-muted-foreground">Predicted future product needs</p>
                  </div>
                  <Switch id="forecasts" defaultChecked={selectedProvider.sharedCategories >= 5} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data Sync Schedule</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Daily
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Weekly
                  </Button>
                  <Button variant="outline" className="justify-start bg-blue-50">
                    <Clock className="mr-2 h-4 w-4" />
                    Real-time
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Manual
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDataManagementOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDataManagementOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
