"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, ExternalLink } from "lucide-react"

interface FileDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    url: string
    size: number
    uploadedAt: Date
    status: string
  } | null
}

export default function FileDetailsModal({ isOpen, onClose, file }: Readonly<FileDetailsModalProps>) {
  const [fileInfo, setFileInfo] = useState<any>(null)

  useEffect(() => {
    if (isOpen && file) {
      fetchFileDetails()
    }
  }, [isOpen, file])

  const getFileContentType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case "csv":
        return "text/csv"
      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      case "pdf":
        return "application/pdf"
      case "txt":
        return "text/plain"
      case "jpg":
      case "jpeg":
        return "image/jpeg"
      case "png":
        return "image/png"
      case "gif":
        return "image/gif"
      default:
        return "application/octet-stream"
    }
  }
  const fetchFileDetails = async () => {
    if (!file) return

    try {
      // You could add an API endpoint to get detailed file info
      // For now, we'll use the basic file information
      setFileInfo({
        contentType: getFileContentType(file.name),
        cacheControl: "public, max-age=31536000",
      })
    } catch (error) {
      console.error("Failed to fetch file details:", error)
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (!file) return null
 console.log("loading", loading);
 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>File Details</DialogTitle>
          <DialogDescription>Detailed information about the uploaded file</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={"File Name"} className="text-sm font-medium text-muted-foreground">File Name</label>
              <p className="text-sm font-mono bg-muted p-2 rounded">{file.name}</p>
            </div>
            <div>
              <label htmlFor={"Size"} className="text-sm font-medium text-muted-foreground">Size</label>
              <p className="text-sm">{formatFileSize(file.size)}</p>
            </div>
            <div>
              <label htmlFor={"Status"} className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant="default">{file.status}</Badge>
            </div>
            <div>
              <label htmlFor={"Uploaded"} className="text-sm font-medium text-muted-foreground">Uploaded</label>
              <p className="text-sm">{formatDate(file.uploadedAt)}</p>
            </div>
          </div>

          {/* File URL */}
          <div>
            <label htmlFor="File URL" className="text-sm font-medium text-muted-foreground">File URL</label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-mono bg-muted p-2 rounded flex-1 truncate">{file.url}</p>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(file.url)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Technical Details */}
          {fileInfo && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Technical Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label htmlFor="Content Type" className="font-medium text-muted-foreground">Content Type</label>
                  <p className="font-mono">{fileInfo.contentType}</p>
                </div>
                <div>
                  <label htmlFor={"cache control"} className="font-medium text-muted-foreground">Cache Control</label>
                  <p className="font-mono">{fileInfo.cacheControl}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(file.url, "_blank")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => window.open(file.url, "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
