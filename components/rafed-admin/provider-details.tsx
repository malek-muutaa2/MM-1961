"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Sample provider data - Updated for Abu Dhabi
const getProviderData = (id: string) => {
  const providers = {
    "1": {
      id: "1",
      name: "Sheikh Khalifa Medical City",
      region: "Abu Dhabi City",
      type: "Tertiary",
      address: "Airport Road, Abu Dhabi, United Arab Emirates",
      phone: "+971 2 819 4100",
      email: "info@skmc.ae",
      contactPerson: "Dr. Ahmed Al Mansoori",
      contactEmail: "ahmed.almansoori@skmc.ae",
      contactPhone: "+971 2 819 4000",
      submissionHistory: [
        {
          id: "sub-101",
          period: "October 2023",
          submissionDate: "2023-10-19T15:30:00",
          status: "submitted",
          fileName: "SKMC_Forecast_Oct2023.xlsx",
          fileSize: "2.4 MB",
          productsCount: 142,
          categoriesCount: 12,
          anomalies: 5,
          acknowledged: 3,
        },
        {
          id: "sub-102",
          period: "September 2023",
          submissionDate: "2023-09-20T10:15:00",
          status: "submitted",
          fileName: "SKMC_Forecast_Sep2023.xlsx",
          fileSize: "2.3 MB",
          productsCount: 138,
          categoriesCount: 12,
          anomalies: 4,
          acknowledged: 4,
        },
        {
          id: "sub-103",
          period: "August 2023",
          submissionDate: "2023-08-22T11:45:00",
          status: "submitted",
          fileName: "SKMC_Forecast_Aug2023.xlsx",
          fileSize: "2.5 MB",
          productsCount: 145,
          categoriesCount: 12,
          anomalies: 7,
          acknowledged: 5,
        },
      ],
      topProducts: [
        { name: "Insulin Glargine 100 units/ml", category: "Diabetes", forecastQuantity: 12500 },
        { name: "Ceftriaxone 1g Injection", category: "Antibiotics", forecastQuantity: 8700 },
        { name: "Paracetamol 500mg Tablets", category: "Analgesics", forecastQuantity: 45000 },
        { name: "Enoxaparin 40mg/0.4ml", category: "Anticoagulants", forecastQuantity: 6300 },
        { name: "Omeprazole 20mg Capsules", category: "Gastrointestinal", forecastQuantity: 22000 },
      ],
      submissionRate: 100,
      averageSubmissionDay: 21,
      anomaliesDetected: 16, // Total anomalies across all submissions
      anomaliesAcknowledged: 12, // Total acknowledged anomalies
    },
    // Add more providers as needed
  }

  return providers[id as keyof typeof providers] || null
}

export function ProviderDetails({ providerId }: { providerId: string }) {
  const router = useRouter()
  const provider = getProviderData(providerId)
  const [activeTab, setActiveTab] = useState("overview")

  if (!provider) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Provider not found</h3>
        <p className="text-muted-foreground mt-2">The provider you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
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
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return null
    }
  }

  // Calculate acknowledgment rate
  const acknowledgmentRate = (provider.anomaliesAcknowledged / provider.anomaliesDetected) * 100 || 0

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Providers
      </Button>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="flex items-center">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold">{provider.name}</h2>
            </div>
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{provider.region}, United Arab Emirates</span>
              <span className="mx-2">•</span>
              <span>{provider.type} Hospital</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mr-2">
              {provider.submissionRate}% Submission Rate
            </Badge>
            {provider.anomaliesDetected > 0 && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                {provider.anomaliesAcknowledged}/{provider.anomaliesDetected} Anomalies Acknowledged
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submission History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">{provider.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">Primary Contact</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">{provider.contactEmail}</div>
                    <div className="text-sm text-muted-foreground">Email Address</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">{provider.contactPhone}</div>
                    <div className="text-sm text-muted-foreground">Phone Number</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">{provider.address}</div>
                    <div className="text-sm text-muted-foreground">Address</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Submission Rate</div>
                  <div className="font-medium">{provider.submissionRate}%</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${provider.submissionRate}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">Average Submission Day</div>
                  <div className="font-medium">Day {provider.averageSubmissionDay} of Month</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${provider.averageSubmissionDay <= 20 ? "bg-green-500" : "bg-yellow-500"} h-2.5 rounded-full`}
                    style={{ width: `${(provider.averageSubmissionDay / 25) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">Anomalies Acknowledged</div>
                  <div className="font-medium">
                    {provider.anomaliesAcknowledged}/{provider.anomaliesDetected}
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${acknowledgmentRate >= 80 ? "bg-green-500" : acknowledgmentRate >= 50 ? "bg-yellow-500" : "bg-red-500"} h-2.5 rounded-full`}
                    style={{ width: `${acknowledgmentRate}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
              <CardDescription>Past forecast submissions from this provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Anomalies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {provider.submissionHistory.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.period}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                          {submission.fileName}
                        </div>
                      </TableCell>
                      <TableCell>{submission.productsCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <AlertCircle
                            className={`h-4 w-4 mr-1.5 ${submission.anomalies === submission.acknowledged ? "text-green-500" : "text-amber-500"}`}
                          />
                          <span>
                            <span
                              className={
                                submission.anomalies === submission.acknowledged ? "text-green-600" : "text-amber-600"
                              }
                            >
                              {submission.acknowledged}/{submission.anomalies}
                            </span>
                            <span className="text-muted-foreground ml-1">acknowledged</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => router.push(`/rafed-provider/history/${submission.id}`)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Forecast
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
