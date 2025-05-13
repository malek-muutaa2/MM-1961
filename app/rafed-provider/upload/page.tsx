"use client"

import { useState } from "react"
import { ForecastUploader } from "@/components/rafed-provider/forecast-uploader"
import { UploadGuidelines } from "@/components/rafed-provider/upload-guidelines"
import { AnomalyStatistics } from "@/components/rafed-provider/anomaly-statistics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarClock, AlertTriangle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Calculate days until deadline (25th of current month)
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const deadline = new Date(currentYear, currentMonth, 25)

  // If today is past the 25th, set deadline to 25th of next month
  if (today > deadline) {
    deadline.setMonth(deadline.getMonth() + 1)
  }

  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const isUrgent = daysUntilDeadline <= 5 && !isSubmitted

  // Format deadline for display
  const deadlineFormatted = deadline.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get month name for the forecast period (next month)
  const forecastMonth = new Date(
    deadline.getMonth() === 11 ? deadline.getFullYear() + 1 : deadline.getFullYear(),
    deadline.getMonth() === 11 ? 0 : deadline.getMonth() + 1,
    1,
  ).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Handle successful upload
  const handleUploadSuccess = () => {
    setIsSubmitted(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upload Forecast</h1>
        <p className="text-muted-foreground">Upload your monthly forecast file before the 25th of each month</p>
      </div>

      {isUrgent && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Deadline Approaching</AlertTitle>
          <AlertDescription>
            You have {daysUntilDeadline} day{daysUntilDeadline !== 1 ? "s" : ""} left to submit your forecast for{" "}
            {forecastMonth}.
          </AlertDescription>
        </Alert>
      )}

      {isSubmitted && (
        <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Forecast Uploaded</AlertTitle>
          <AlertDescription>
            Your forecast for {forecastMonth} has been successfully submitted. You cannot upload another file for this
            period.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Forecast File</CardTitle>
              <CardDescription>Please ensure your file follows the required format</CardDescription>
            </CardHeader>
            <CardContent>
              <ForecastUploader onUploadSuccess={handleUploadSuccess} isSubmitted={isSubmitted} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="deadline">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deadline">Deadline</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>
            <TabsContent value="deadline">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5" />
                    Submission Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className={`rounded-lg ${
                        isSubmitted
                          ? "bg-green-50 dark:bg-green-950"
                          : isUrgent
                            ? "bg-red-50 dark:bg-red-950"
                            : "bg-amber-50 dark:bg-amber-950"
                      } p-4`}
                    >
                      <h3
                        className={`font-semibold ${
                          isSubmitted
                            ? "text-green-800 dark:text-green-300"
                            : isUrgent
                              ? "text-red-800 dark:text-red-300"
                              : "text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {isSubmitted ? "Forecast Uploaded" : "Next Deadline"}
                      </h3>
                      <p
                        className={`mt-1 text-lg font-bold ${
                          isSubmitted
                            ? "text-green-700 dark:text-green-400"
                            : isUrgent
                              ? "text-red-700 dark:text-red-400"
                              : "text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {isSubmitted ? "Completed" : deadlineFormatted}
                      </p>
                      <p
                        className={`mt-2 text-sm ${
                          isSubmitted
                            ? "text-green-600 dark:text-green-500"
                            : isUrgent
                              ? "text-red-600 dark:text-red-500"
                              : "text-amber-600 dark:text-amber-500"
                        }`}
                      >
                        {isSubmitted
                          ? `Your forecast for ${forecastMonth} has been submitted successfully.`
                          : `${daysUntilDeadline} day${
                              daysUntilDeadline !== 1 ? "s" : ""
                            } remaining to submit your forecast for ${forecastMonth}.`}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Why is this important?</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Timely submissions help Rafed plan inventory and ensure product availability. Late submissions
                        may result in supply chain disruptions.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">What happens if I miss the deadline?</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Missing the deadline may impact product availability and could affect your service level
                        agreements. If you anticipate delays, please contact your Rafed account manager.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="guidelines">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <UploadGuidelines />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Anomaly Statistics Section - Only shown after submission */}
      {isSubmitted && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Anomalies Detected in Your Submission</h2>
            <p className="text-muted-foreground">
              Please review and acknowledge any anomalies detected in your forecast submission
            </p>
          </div>
          <AnomalyStatistics isNewSubmission={true} />
        </div>
      )}
    </div>
  )
}
