"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Trash2, Eye, FileText } from "lucide-react"
import FileDetailsModal from "./file-details-modal"
import {useToast} from "@/hooks/use-toast";

interface UploadedFile {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: Date
  status: "completed" | "failed" | "partially_completed"
  errorCount?: number
}

export default function FileManager() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/files?prefix=uploads/")
        const data = await response.json()

        const formattedFiles: UploadedFile[] = data?.files?.map((file: any) => ({
          id: file.pathname,
          name: file.name,
          url: file.url,
          size: file.size,
          uploadedAt: new Date(file.uploadedAt),
          status: "completed", // You could enhance this with actual status tracking
        })) ?? []

        setFiles(formattedFiles)
      } catch (error) {
        console.error("Failed to fetch files:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const handleDownload = (file: UploadedFile) => {
    window.open(file.url, "_blank")
  }

  const handleDelete = async (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`/api/files?pathname=${encodeURIComponent(fileId)}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setFiles((prev) => prev.filter((f) => f.id !== fileId))
        } else {
          toast({
            title: "Error",
            description: "Failed to delete file. Please try again.",
            variant: "destructive",
          })
          // alert("Failed to delete file")
        }
      } catch (error) {
        console.error("Failed to delete file:", error)
        // alert("Failed to delete file")
        toast({
            title: "Error",
            description: "Failed to delete file. Please try again.",
            variant: "destructive",
        })
      }
    }
  }

  const handleViewDetails = (file: UploadedFile) => {
    setSelectedFile(file)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Uploaded Files
        </CardTitle>
        <CardDescription>Manage and view your uploaded files</CardDescription>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No files uploaded yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        file.status === "completed"
                          ? "default"
                          : file.status === "partially_completed"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {file.status === "completed" && "Completed"}
                      {file.status === "partially_completed" && `${file.errorCount} errors`}
                      {file.status === "failed" && "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(file)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(file.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <FileDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} file={selectedFile} />
    </Card>
  )
}
