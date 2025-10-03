"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, FileWarning, Upload, X, Lock } from "lucide-react"
import type { ValidationIssue } from "@/types/rafed-types"

interface ForecastUploaderProps {
  onUploadSuccess?: () => void
  isSubmitted?: boolean
}

export function ForecastUploader({ onUploadSuccess, isSubmitted = false }: ForecastUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validating, setValidating] = useState(false)
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([])
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setValidationIssues([])
      setUploadComplete(false)
      setUploadError(null)
    }
  }

  const handleUpload = async () => {
    if (!file || isSubmitted) return

    setUploading(true)
    setUploadProgress(0)
    setValidating(false)
    setValidationIssues([])
    setUploadComplete(false)
    setUploadError(null)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setUploading(false)
      setValidating(true)

      // Simulate validation
      setTimeout(() => {
        setValidating(false)

        // Randomly decide if there are validation issues
        const hasIssues = Math.random() > 0.7 //NOSONAR

        if (hasIssues) {
          setValidationIssues([
            {
              type: "error",
              message: 'Missing required column: "Product SKU"',
              column: "Product SKU",
            },
            {
              type: "warning",
              message: "Unusual forecast quantity for product XYZ-123",
              row: 15,
            },
          ])
        } else {
          setUploadComplete(true)
          // Always call onUploadSuccess to show anomaly statistics
          if (onUploadSuccess) {
            onUploadSuccess()
          }
        }
      }, 2000)
    }, 2000)
  }

  const resetUpload = () => {
    if (isSubmitted) return

    setFile(null)
    setUploading(false)
    setUploadProgress(0)
    setValidating(false)
    setValidationIssues([])
    setUploadComplete(false)
    setUploadError(null)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <Lock className="mb-4 h-12 w-12 text-green-500" />
          <h3 className="mb-2 text-lg font-semibold">Forecast Submitted</h3>
          <p className="text-sm text-muted-foreground">
            You have already submitted your forecast for this period. No further uploads are allowed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!uploading && !validating && !uploadComplete && validationIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <Upload className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold">Upload your forecast file</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Drag and drop your Excel or CSV file here, or click to browse
          </p>
          <Input type="file" accept=".xlsx,.xls,.csv" className="max-w-xs" onChange={handleFileChange} />
        </div>
      )}

      {file && !uploading && !validating && !uploadComplete && validationIssues.length === 0 && (
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <FileWarning className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={resetUpload}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpload}>
              <Upload className="mr-1 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex justify-between">
            <p className="font-medium">Uploading {file?.name}</p>
            <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {validating && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="font-medium">Validating file...</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            We're checking your file for any issues. This may take a moment.
          </p>
        </div>
      )}

      {validationIssues.length > 0 && (
        <div className="space-y-4">
          <Alert variant="destructive">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Validation Failed</AlertTitle>
            <AlertDescription>Please fix the following issues and upload again.</AlertDescription>
          </Alert>

          <div className="rounded-lg border">
            <div className="border-b px-4 py-3">
              <h3 className="font-semibold">Validation Issues</h3>
            </div>
            <div className="divide-y">
              {validationIssues.map((issue, index) => (
                <div key={index} className="px-4 py-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`mt-0.5 rounded-full p-1 ${issue.type === "error" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"}`}
                    >
                      <FileWarning className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{issue.message}</p>
                      {issue.column && <p className="text-sm text-muted-foreground">Column: {issue.column}</p>}
                      {issue.row !== undefined && <p className="text-sm text-muted-foreground">Row: {issue.row}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={resetUpload}>
              Cancel
            </Button>
            <Button onClick={resetUpload}>Try Again</Button>
          </div>
        </div>
      )}

      {uploadComplete && (
        <div className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Upload Successful</AlertTitle>
            <AlertDescription>
              Your forecast file has been uploaded, validated, and submitted successfully. No further uploads are
              allowed for this period.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">{file?.name}</p>
                <p className="text-sm text-muted-foreground">Submitted successfully</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <Alert variant="destructive">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
