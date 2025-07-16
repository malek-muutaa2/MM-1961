"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, Cloud, Database, Globe, HardDrive } from "lucide-react"

interface FilePropertiesModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    url: string
    size: number
    uploadedAt: Date
    status: string
    storage_type: string
    config_id?: string
    config_name?: string
    pathname: string
  } | null
}

export default function FilePropertiesModal({ isOpen, onClose, file }: Readonly<FilePropertiesModalProps>) {
  const [configDetails, setConfigDetails] = useState<any>(null)
  const [storageDetails, setStorageDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && file) {
      fetchFileProperties()
    }
  }, [isOpen, file])

  const fetchFileProperties = async () => {
    if (!file) return

    setLoading(true)
    try {
      // Fetch configuration and storage details
      const promises = []

      if (file.config_id) {
        promises.push(fetch(`/api/configurations/${file.config_id}`))
      }

      promises.push(fetch(`/api/files/${file.id}/properties`))

      const responses = await Promise.all(promises)
      const results = await Promise.all(responses.map((r) => r.json()))

      if (file.config_id) {
        setConfigDetails(results[0])
        setStorageDetails(results[1]?.storage_config)
      } else {
        setStorageDetails(results[0]?.storage_config)
      }
    } catch (error) {
      console.error("Failed to fetch file properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(new Date(date))
  }

  const getStorageIcon = (storageType: string) => {
    switch (storageType) {
      case "vercel_blob":
        return <Globe className="h-5 w-5" />
      case "s3":
        return <Cloud className="h-5 w-5" />
      case "gcs":
        return <Cloud className="h-5 w-5" />
      case "azure_blob":
        return <Cloud className="h-5 w-5" />
      default:
        return <HardDrive className="h-5 w-5" />
    }
  }

  const getStorageLabel = (storageType: string) => {
    switch (storageType) {
      case "vercel_blob":
        return "Vercel Blob Storage"
      case "s3":
        return "Amazon S3"
      case "gcs":
        return "Google Cloud Storage"
      case "azure_blob":
        return "Azure Blob Storage"
      default:
        return storageType
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (!file) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>File Properties</DialogTitle>
          <DialogDescription>Detailed information about the file and its configuration</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">File Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fileName" className="text-sm font-medium text-muted-foreground">File Name</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{file.name}</p>
                </div>
                <div>
                  <label htmlFor="fileSize" className="text-sm font-medium text-muted-foreground">Size</label>
                  <p className="text-sm">{formatFileSize(file.size)}</p>
                </div>
                <div>
                  <label htmlFor="fileStatus" className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant="default">{file.status}</Badge>
                </div>
                <div>
                  <label htmlFor="fileUploadedAt" className="text-sm font-medium text-muted-foreground">Uploaded</label>
                  <p className="text-sm">{formatDate(file.uploadedAt)}</p>
                </div>
                <div className="col-span-2">
                  <label htmlFor="filePath" className="text-sm font-medium text-muted-foreground">File Path</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono bg-muted p-2 rounded flex-1 truncate">{file.pathname}</p>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(file.pathname)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label htmlFor="fileUrl" className="text-sm font-medium text-muted-foreground">File URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono bg-muted p-2 rounded flex-1 truncate">{file.url}</p>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(file.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(file.url, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Storage Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {getStorageIcon(file.storage_type)}
                Storage Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="storageProvider" className="text-sm font-medium text-muted-foreground">Storage Provider</label>
                  <p className="text-sm">{getStorageLabel(file.storage_type)}</p>
                </div>
                {storageDetails && (
                  <>
                    <div>
                      <label htmlFor="storageConfiguration" className="text-sm font-medium text-muted-foreground">Storage Configuration</label>
                      <p className="text-sm">{storageDetails.name}</p>
                    </div>
                    <div>
                      <label htmlFor="basePath" className="text-sm font-medium text-muted-foreground">Base Path</label>
                      <p className="text-sm font-mono">{storageDetails.base_path}</p>
                    </div>
                    <div>
                      <label htmlFor="pathTemplate" className="text-sm font-medium text-muted-foreground">Path Template</label>
                      <p className="text-sm font-mono">{storageDetails.path_template}</p>
                    </div>
                    {storageDetails.bucket_name && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          {file.storage_type === "azure_blob" ? "Container" : "Bucket"}
                        </label>
                        <p className="text-sm">{storageDetails.bucket_name}</p>
                      </div>
                    )}
                    {storageDetails.region && (
                      <div>
                        <label htmlFor="region" className="text-sm font-medium text-muted-foreground">Region</label>
                        <p className="text-sm">{storageDetails.region}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Configuration Information */}
            {configDetails && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Upload Configuration
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="configurationName" className="text-sm font-medium text-muted-foreground">Configuration Name</label>
                      <p className="text-sm">{configDetails.name}</p>
                    </div>
                    <div>
                      <label htmlFor="organizationType" className="text-sm font-medium text-muted-foreground">Organization Type</label>
                      <p className="text-sm">{configDetails.organization_type}</p>
                    </div>
                    <div>
                      <label htmlFor="sourceType" className="text-sm font-medium text-muted-foreground">Source Type</label>
                      <p className="text-sm">{configDetails.source_type}</p>
                    </div>
                    <div>
                      <label htmlFor="fileTypes" className="text-sm font-medium text-muted-foreground">File Types</label>
                      <p className="text-sm">{configDetails.file_type}</p>
                    </div>
                    <div>
                      <label htmlFor="delimiter" className="text-sm font-medium text-muted-foreground">Delimiter</label>
                      <p className="text-sm font-mono">{configDetails.delimiter}</p>
                    </div>
                    <div>
                      <label htmlFor="maxFileSize" className="text-sm font-medium text-muted-foreground">Max File Size</label>
                      <p className="text-sm">{formatFileSize(configDetails?.max_file_size)}</p>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="description" className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-sm">{configDetails.description}</p>
                    </div>
                  </div>

                  {configDetails.columns && configDetails.columns.length > 0 && (
                    <div className="mt-4">
                      <label htmlFor="columnDefinitions" className="text-sm font-medium text-muted-foreground">Column Definitions</label>
                      <div className="mt-2 space-y-2">
                        {configDetails.columns.map((column: any, index: number) => (
                            <div key={column.name} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">{column.data_type}</Badge>
                            <span className="font-medium">{column.display_name}</span>
                            <span className="text-muted-foreground">({column.name})</span>
                            {column.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
