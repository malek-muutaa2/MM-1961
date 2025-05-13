"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, AlertTriangle, Search, Eye, FileCheck, Building, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Sample data for provider submissions - Updated for Abu Dhabi
const sampleProviders = [
  {
    id: "1",
    name: "Sheikh Khalifa Medical City",
    region: "Abu Dhabi City",
    type: "Tertiary",
    lastSubmission: "2023-10-19T15:30:00",
    status: "submitted",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: 6,
    anomalies: 5,
    acknowledged: 3,
  },
  {
    id: "2",
    name: "Cleveland Clinic Abu Dhabi",
    region: "Al Maryah Island",
    type: "Tertiary",
    lastSubmission: "2023-10-20T10:15:00",
    status: "submitted",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: 5,
    anomalies: 2,
    acknowledged: 2,
  },
  {
    id: "3",
    name: "Burjeel Medical City",
    region: "Mohammed Bin Zayed City",
    type: "Tertiary",
    lastSubmission: null,
    status: "pending",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: null,
    anomalies: 0,
    acknowledged: 0,
  },
  {
    id: "4",
    name: "Zayed Military Hospital",
    region: "Abu Dhabi City",
    type: "Military",
    lastSubmission: "2023-10-18T09:45:00",
    status: "submitted",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: 7,
    anomalies: 8,
    acknowledged: 4,
  },
  {
    id: "5",
    name: "Khalidiya Health Center",
    region: "Khalidiya",
    type: "Primary",
    lastSubmission: null,
    status: "pending",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: null,
    anomalies: 0,
    acknowledged: 0,
  },
  {
    id: "6",
    name: "NMC Royal Hospital",
    region: "Khalifa City",
    type: "Tertiary",
    lastSubmission: "2023-10-22T14:20:00",
    status: "submitted",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: 3,
    anomalies: 3,
    acknowledged: 1,
  },
  {
    id: "7",
    name: "Mafraq Hospital",
    region: "Baniyas",
    type: "Secondary",
    lastSubmission: null,
    status: "pending",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: null,
    anomalies: 0,
    acknowledged: 0,
  },
  {
    id: "8",
    name: "Al Rahba Hospital",
    region: "Al Rahba",
    type: "Secondary",
    lastSubmission: "2023-10-17T11:30:00",
    status: "submitted",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: 8,
    anomalies: 1,
    acknowledged: 0,
  },
  {
    id: "9",
    name: "Danat Al Emarat Hospital",
    region: "Abu Dhabi City",
    type: "Specialized",
    lastSubmission: null,
    status: "pending",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: null,
    anomalies: 0,
    acknowledged: 0,
  },
  {
    id: "10",
    name: "Healthpoint Hospital",
    region: "Zayed Sports City",
    type: "Tertiary",
    lastSubmission: "2023-10-21T16:45:00",
    status: "submitted",
    submissionMonth: "October",
    submissionYear: "2023",
    daysBeforeDeadline: 4,
    anomalies: 4,
    acknowledged: 3,
  },
]

export function ProviderSubmissions() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Get current date for deadline calculation
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const daysUntilDeadline = 25 - currentDay > 0 ? 25 - currentDay : 0
  const isPastDeadline = currentDay > 25

  // Filter providers based on search term and filters
  const filteredProviders = sampleProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRegion = regionFilter === "all" || provider.region === regionFilter
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter

    return matchesSearch && matchesRegion && matchesStatus
  })

  const handleViewDetails = (id: string) => {
    // Fix the navigation path to point to the correct provider details page
    router.push(`/rafed-admin/providers/${id}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Submitted
          </Badge>
        )
      case "pending":
        return isPastDeadline ? (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Overdue
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const getAnomalyStatus = (anomalies: number, acknowledged: number) => {
    if (anomalies === 0) return null

    const unacknowledged = anomalies - acknowledged
    const allAcknowledged = unacknowledged === 0

    return (
      <div className="flex items-center">
        <AlertCircle className={`h-4 w-4 mr-1.5 ${allAcknowledged ? "text-green-500" : "text-amber-500"}`} />
        <span>
          <span className={allAcknowledged ? "text-green-600" : "text-amber-600"}>
            {acknowledged}/{anomalies}
          </span>
          <span className="text-muted-foreground ml-1">acknowledged</span>
        </span>
      </div>
    )
  }

  const submittedCount = filteredProviders.filter((p) => p.status === "submitted").length
  const pendingCount = filteredProviders.filter((p) => p.status === "pending").length
  const submissionRate = (submittedCount / filteredProviders.length) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="text-sm text-green-600">Submitted</div>
          <div className="text-2xl font-bold mt-1">{submittedCount}</div>
          <div className="text-sm text-muted-foreground mt-1">{Math.round(submissionRate)}% of providers</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="text-sm text-yellow-600">Pending</div>
          <div className="text-2xl font-bold mt-1">{pendingCount}</div>
          <div className="text-sm text-muted-foreground mt-1">{Math.round(100 - submissionRate)}% of providers</div>
        </div>

        <div
          className={`${isPastDeadline ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"} border rounded-lg p-4`}
        >
          <div className={isPastDeadline ? "text-sm text-red-600" : "text-sm text-blue-600"}>
            {isPastDeadline ? "Deadline Passed" : "Time Remaining"}
          </div>
          <div className="text-2xl font-bold mt-1">{isPastDeadline ? "October 25th" : `${daysUntilDeadline} days`}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {isPastDeadline ? "Follow up required" : "Until submission deadline"}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Abu Dhabi City">Abu Dhabi City</SelectItem>
              <SelectItem value="Al Maryah Island">Al Maryah Island</SelectItem>
              <SelectItem value="Khalifa City">Khalifa City</SelectItem>
              <SelectItem value="Mohammed Bin Zayed City">Mohammed Bin Zayed City</SelectItem>
              <SelectItem value="Khalidiya">Khalidiya</SelectItem>
              <SelectItem value="Baniyas">Baniyas</SelectItem>
              <SelectItem value="Al Rahba">Al Rahba</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Anomalies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-muted-foreground mr-2" />
                      {provider.name}
                    </div>
                  </TableCell>
                  <TableCell>{provider.region}</TableCell>
                  <TableCell>{provider.type}</TableCell>
                  <TableCell>{getStatusBadge(provider.status)}</TableCell>
                  <TableCell>
                    {provider.lastSubmission ? (
                      <div className="flex items-center">
                        <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                        {new Date(provider.lastSubmission).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not submitted</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {provider.status === "submitted" ? (
                      getAnomalyStatus(provider.anomalies, provider.acknowledged)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(provider.id)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No providers found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
