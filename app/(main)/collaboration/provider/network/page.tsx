"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Hospital, Phone, Mail, MapPin, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Sample hospital data - Updated for Abu Dhabi
const hospitals = [
  {
    id: 1,
    name: "Sheikh Khalifa Medical City",
    type: "Tertiary Hospital",
    location: "Abu Dhabi City",
    phone: "+971 2 819 4100",
    email: "info@skmc.ae",
    status: "active",
    sharedCategories: "4 of 5",
    lastSync: "Today, 9:45 AM",
    lastSyncStatus: "success",
    forecastAccuracy: "94%",
    forecastTrend: "up",
    products: "128",
    departments: ["Emergency", "Surgery", "Cardiology", "Oncology", "Pediatrics"],
    contactPerson: "Dr. Ahmed Al Mansoori",
    contactRole: "Supply Chain Director",
    joinedDate: "March 15, 2023",
  },
  {
    id: 2,
    name: "Cleveland Clinic Abu Dhabi",
    type: "Specialty Hospital",
    location: "Al Maryah Island",
    phone: "+971 2 659 6666",
    email: "info@clevelandclinicabudhabi.ae",
    status: "active",
    sharedCategories: "3 of 5",
    lastSync: "Yesterday",
    lastSyncStatus: "success",
    forecastAccuracy: "87%",
    forecastTrend: "up",
    products: "92",
    departments: ["Emergency", "Surgery", "Internal Medicine", "Radiology"],
    contactPerson: "Michael Chen",
    contactRole: "Procurement Manager",
    joinedDate: "June 22, 2023",
  },
  {
    id: 3,
    name: "Burjeel Medical City",
    type: "Specialty Hospital",
    location: "Mohammed Bin Zayed City",
    phone: "+971 2 508 5555",
    email: "info@burjeelmedicalcity.com",
    status: "needs_attention",
    sharedCategories: "2 of 5",
    lastSync: "5 days ago",
    lastSyncStatus: "warning",
    forecastAccuracy: "76%",
    forecastTrend: "warning",
    products: "64",
    departments: ["Orthopedics", "Neurology", "Rehabilitation"],
    contactPerson: "Lisa Rodriguez",
    contactRole: "Operations Director",
    joinedDate: "October 5, 2023",
  },
  {
    id: 4,
    name: "Zayed Military Hospital",
    type: "Military Hospital",
    location: "Abu Dhabi City",
    phone: "+971 2 441 7000",
    email: "info@zmh.ae",
    status: "pending",
    invitedDate: "2 days ago",
    contactPerson: "Robert Williams",
    contactRole: "Chief Operating Officer",
  },
  {
    id: 5,
    name: "NMC Royal Hospital",
    type: "Private Hospital",
    location: "Khalifa City",
    phone: "+971 2 631 3333",
    email: "info@nmchealth.com",
    status: "pending",
    invitedDate: "1 week ago",
    contactPerson: "Jennifer Taylor",
    contactRole: "VP of Supply Chain",
  },
  {
    id: 6,
    name: "Healthpoint Hospital",
    type: "Specialty Hospital",
    location: "Zayed Sports City",
    phone: "+971 2 502 2000",
    email: "info@healthpoint.ae",
    status: "pending",
    invitedDate: "3 days ago",
    contactPerson: "Thomas Brown",
    contactRole: "Materials Manager",
  },
]

export default function HospitalNetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [dataManagementOpen, setDataManagementOpen] = useState(false)

  const activeHospitals = hospitals.filter((h) => h.status === "active" || h.status === "needs_attention")
  const pendingHospitals = hospitals.filter((h) => h.status === "pending")

  const filteredActiveHospitals = activeHospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPendingHospitals = pendingHospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAllHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const viewDetails = (hospital: any) => {
    setSelectedHospital(hospital)
    setDetailsOpen(true)
  }

  const manageData = (hospital: any) => {
    setSelectedHospital(hospital)
    setDataManagementOpen(true)
  }

  const renderHospitalCard = (hospital: any) => (
    <Card key={hospital.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-md">
              <Hospital className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <CardTitle>{hospital.name}</CardTitle>
              <CardDescription>{hospital.type}</CardDescription>
            </div>
          </div>
          {hospital.status === "active" && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
          )}
          {hospital.status === "needs_attention" && (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Attention</Badge>
          )}
          {hospital.status === "pending" && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Invited</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{hospital.location}</span>
          </div>
          {hospital.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{hospital.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{hospital.email}</span>
          </div>
          {hospital.status === "pending" && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Invited {hospital.invitedDate}</span>
            </div>
          )}
        </div>

        {(hospital.status === "active" || hospital.status === "needs_attention") && (
          <div className="mt-4 pt-3 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Shared Data Categories</span>
                <span className="font-medium">{hospital.sharedCategories}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Last Sync</span>
                <span className={`font-medium ${hospital.lastSyncStatus === "warning" ? "text-amber-600" : ""}`}>
                  {hospital.lastSync}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Forecast Accuracy</span>
                <div className="flex items-center">
                  <span className={`font-medium ${hospital.forecastTrend === "warning" ? "text-amber-600" : ""}`}>
                    {hospital.forecastAccuracy}
                  </span>
                  {hospital.forecastTrend === "up" && <TrendingUp className="h-3 w-3 text-green-600 ml-1" />}
                  {hospital.forecastTrend === "warning" && <AlertCircle className="h-3 w-3 text-amber-600 ml-1" />}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Products</span>
                <span className="font-medium">{hospital.products}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {hospital.status === "pending" ? (
          <>
            <Button variant="outline" size="sm">
              Resend Invite
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => viewDetails(hospital)}>
              View Details
            </Button>
            <Button size="sm" onClick={() => manageData(hospital)}>
              Manage Data
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hospital Network</h2>
          <p className="text-muted-foreground">Manage your connected hospitals and collaborative forecasting</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            className="w-[250px]"
            placeholder="Search hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button asChild>
            <Link href="/collaboration/provider/invite">Add Hospital</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Connections ({activeHospitals.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Invitations ({pendingHospitals.length})</TabsTrigger>
          <TabsTrigger value="all">All Hospitals ({hospitals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredActiveHospitals.map(renderHospitalCard)}
          </div>
          {filteredActiveHospitals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No active hospitals match your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPendingHospitals.map(renderHospitalCard)}
          </div>
          {filteredPendingHospitals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No pending invitations match your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredAllHospitals.map(renderHospitalCard)}</div>
          {filteredAllHospitals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hospitals match your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Hospital Details Dialog */}
      {selectedHospital && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedHospital.name}</DialogTitle>
              <DialogDescription>
                {selectedHospital.type} • {selectedHospital.location}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Hospital Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Person:</span>
                    <span className="font-medium">{selectedHospital.contactPerson}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span>{selectedHospital.contactRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{selectedHospital.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedHospital.email}</span>
                  </div>
                  {selectedHospital.joinedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{selectedHospital.joinedDate}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-medium mt-6 mb-2">Departments</h3>
                {selectedHospital.departments ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.departments.map((dept: any, i: any) => (
                      <Badge key={`${i+1}`} variant="outline">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No department information available</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Data Sharing Status</h3>
                {selectedHospital.status !== "pending" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Forecast Accuracy</span>
                      <div className="flex items-center">
                        <span
                          className={`font-medium ${selectedHospital.forecastTrend === "warning" ? "text-amber-600" : "text-green-600"}`}
                        >
                          {selectedHospital.forecastAccuracy}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Last Data Sync</span>
                      <span className={selectedHospital.lastSyncStatus === "warning" ? "text-amber-600" : ""}>
                        {selectedHospital.lastSync}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Products Tracked</span>
                      <span>{selectedHospital.products}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Data Categories Shared</span>
                      <span>{selectedHospital.sharedCategories}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <p className="text-blue-700">Invitation sent {selectedHospital.invitedDate}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Waiting for hospital to accept invitation and set up data sharing.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              {selectedHospital.status !== "pending" && (
                <Button
                  onClick={() => {
                    setDetailsOpen(false)
                    manageData(selectedHospital)
                  }}
                >
                  Manage Data Sharing
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Data Management Dialog */}
      {selectedHospital && (
        <Dialog open={dataManagementOpen} onOpenChange={setDataManagementOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Manage Data Sharing</DialogTitle>
              <DialogDescription>Configure data sharing settings for {selectedHospital.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Categories</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inventory-data">Inventory Data</Label>
                      <p className="text-sm text-muted-foreground">Current stock levels and par levels</p>
                    </div>
                    <Switch id="inventory-data" defaultChecked={true} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="usage-data">Usage Data</Label>
                      <p className="text-sm text-muted-foreground">Historical product consumption patterns</p>
                    </div>
                    <Switch id="usage-data" defaultChecked={true} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="procedure-data">Procedure Data</Label>
                      <p className="text-sm text-muted-foreground">Scheduled procedures and associated supplies</p>
                    </div>
                    <Switch id="procedure-data" defaultChecked={selectedHospital.id === 1} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="expiration-data">Expiration Data</Label>
                      <p className="text-sm text-muted-foreground">Product expiration tracking</p>
                    </div>
                    <Switch id="expiration-data" defaultChecked={selectedHospital.id !== 3} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="forecast-data">Forecast Sharing</Label>
                      <p className="text-sm text-muted-foreground">AI-generated demand forecasts</p>
                    </div>
                    <Switch id="forecast-data" defaultChecked={selectedHospital.id !== 3} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Data Sync Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <select
                      id="sync-frequency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      defaultValue="daily"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="sync-time">Preferred Sync Time</Label>
                    <select
                      id="sync-time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      defaultValue="midnight"
                    >
                      <option value="midnight">12:00 AM (Midnight)</option>
                      <option value="morning">6:00 AM</option>
                      <option value="noon">12:00 PM (Noon)</option>
                      <option value="evening">6:00 PM</option>
                    </select>
                  </div>
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
