"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CheckCircle, XCircle, AlertTriangle, Clock, ArrowRight, FileCheck, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for submission status
const currentYear = new Date().getFullYear()
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const currentMonth = new Date().getMonth()

const sampleSubmissions = months.map((month, index) => {
  const status = index < currentMonth ? "submitted" : index === currentMonth ? "pending" : "upcoming"
  const dueDate = new Date(currentYear, index, 25)
  const submissionDate = index < currentMonth ? new Date(currentYear, index, Math.floor(Math.random() * 24) + 1) : null

  return {
    month,
    year: currentYear,
    status,
    dueDate,
    submissionDate,
    fileName: status === "submitted" ? `${month}${currentYear}_Forecast.xlsx` : null,
  }
})

export function SubmissionStatus() {
  const router = useRouter()
  const [yearFilter, setYearFilter] = useState<string>(currentYear.toString())

  // Get current date for deadline calculation
  const currentDate = new Date()
  const currentMonthName = months[currentDate.getMonth()]
  const currentDay = currentDate.getDate()
  const daysUntilDeadline = currentDay <= 25 ? 25 - currentDay : 0
  const isCloseToDeadline = daysUntilDeadline <= 5 && daysUntilDeadline > 0
  const isPastDeadline = currentDay > 25

  const handleUploadClick = () => {
    router.push("/rafed-provider/upload")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Current Month: {currentMonthName} {currentYear}
          </span>
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
            <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(isCloseToDeadline || isPastDeadline) && (
        <Card className={isPastDeadline ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              {isPastDeadline ? (
                <XCircle className="h-6 w-6 text-red-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5" />
              )}
              <div>
                <h3 className="font-medium">
                  {isPastDeadline ? "Deadline Missed" : `Deadline Approaching: ${daysUntilDeadline} days left`}
                </h3>
                <p className="text-sm mt-1">
                  {isPastDeadline
                    ? "You've missed the submission deadline for this month. Please contact Rafed support."
                    : "Please submit your forecast before the 25th of this month."}
                </p>
                {!isPastDeadline && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Monthly Submissions</h3>

        <div className="space-y-4">
          {sampleSubmissions
            .filter((submission) => submission.year.toString() === yearFilter)
            .map((submission, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  submission.status === "submitted"
                    ? "border-green-200 bg-green-50"
                    : submission.status === "pending"
                      ? (isPastDeadline ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50")
                      : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    {submission.status === "submitted" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : submission.status === "pending" ? (
                      isPastDeadline ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h4 className="font-medium">
                        {submission.month} {submission.year}
                      </h4>
                      <div className="flex items-center mt-1">
                        {submission.status === "submitted" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </Badge>
                        ) : submission.status === "pending" ? (
                          isPastDeadline ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {submission.dueDate.toLocaleDateString()}
                    </div>

                    {submission.submissionDate && (
                      <div className="text-sm text-green-600 flex items-center mt-1">
                        <FileCheck className="h-4 w-4 mr-1" />
                        Submitted: {submission.submissionDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div>
                    {submission.status === "submitted" ? (
                      <Button variant="outline" size="sm" onClick={() => router.push(`/rafed-provider/history`)}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : submission.status === "pending" ? (
                      <Button
                        variant={isPastDeadline ? "destructive" : "default"}
                        size="sm"
                        onClick={handleUploadClick}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isPastDeadline ? "Submit Late" : "Upload Now"}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Not Yet Due
                      </Button>
                    )}
                  </div>
                </div>

                {submission.status === "pending" && !isPastDeadline && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Remaining</span>
                      <span>{daysUntilDeadline} days left</span>
                    </div>
                    <Progress value={((25 - daysUntilDeadline) / 25) * 100} className="h-2" />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
