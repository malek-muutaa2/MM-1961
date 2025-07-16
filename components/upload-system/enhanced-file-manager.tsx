"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Trash2, Eye, FileText, Search, Info, Cloud, HardDrive, Globe } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FileDetailsModal from "./file-details-modal"
import FilePropertiesModal from "./file-properties-modal"
import {useToast} from "@/hooks/use-toast";

interface UploadedFile {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: Date
  status: "completed" | "failed" | "partially_completed"
  errorCount?: number
  storage_type: string
  config_id?: string
  config_name?: string
  pathname: string
}

interface UploadConfiguration {
  id: string
  name: string
  description: string
}

export default function EnhancedFileManager() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [configurations, setConfigurations] = useState<UploadConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConfig, setSelectedConfig] = useState<string>("all")
  const [selectedStorageType, setSelectedStorageType] = useState<string>("all")
  const { toast } = useToast()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch files and configurations in parallel
      const [filesRes, configsRes] = await Promise.all([fetch("/api/files/enhanced"), fetch("/api/configurations")])

      const [filesData, configsData] = await Promise.all([filesRes.json(), configsRes.json()])

      setFiles(filesData.files || [])
      setConfigurations(configsData || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
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
    if(!date){
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })?.format(new Date())
    }
    const parsedDate = typeof date === "string" ? new Date(date) : date
    console.log("date :: ", parsedDate)
    if (isNaN(parsedDate.getTime())) { // Check if the date is invalid
      console.error("Invalid date!");
      return null
    } else {
      const formattedDate =  new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })?.format(parsedDate);
      console.log(formattedDate);
      return formattedDate
    }


  }

  const getStorageIcon = (storageType: string) => {
    switch (storageType) {
      case "vercel_blob":
        return <Globe className="h-4 w-4" />
      case "s3":
        return <Cloud className="h-4 w-4" />
      case "gcs":
        return <Cloud className="h-4 w-4" />
      case "azure_blob":
        return <Cloud className="h-4 w-4" />
      default:
        return <HardDrive className="h-4 w-4" />
    }
  }

  const getStorageLabel = (storageType: string) => {
    switch (storageType) {
      case "vercel_blob":
        return "Vercel Blob"
      case "s3":
        return "AWS S3"
      case "gcs":
        return "Google Cloud"
      case "azure_blob":
        return "Azure Blob"
      default:
        return storageType
    }
  }

  const handleDownload = (file: UploadedFile) => {
    window.open(file.url, "_blank")
  }

  const handleView = (file: UploadedFile) => {
    setSelectedFile(file)
    setIsDetailsModalOpen(true)
  }

  const handleProperties = (file: UploadedFile) => {
    setSelectedFile(file)
    setIsPropertiesModalOpen(true)
  }

  const handleDelete = async (file: UploadedFile) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        const response = await fetch(`/api/files/${file.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setFiles((prev) => prev.filter((f) => f.id !== file.id))
        } else {
          const error = await response.json()
          // alert(`Failed to delete file: ${error.message}`)
          toast({
            title: "Error",
            description: `Failed to delete file: ${error.message}`,
            variant: "destructive",
          })
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

  // Filter files based on search term, configuration, and storage type
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesConfig = selectedConfig === "all" || file.config_id === selectedConfig
    const matchesStorage = selectedStorageType === "all" || file.storage_type === selectedStorageType

    return matchesSearch && matchesConfig && matchesStorage
  })

  // Group files by storage type
  const groupedFiles = filteredFiles.reduce(
    (groups, file) => {
      const storageType = file.storage_type
      if (!groups[storageType]) {
        groups[storageType] = []
      }
      groups[storageType].push(file)
      return groups
    },
    {} as Record<string, UploadedFile[]>,
  )

  // Sort files within each group by most recent first
  Object.keys(groupedFiles).forEach((storageType) => {
    groupedFiles[storageType].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  })

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
          File Manager
        </CardTitle>
        <CardDescription>Manage and view your uploaded files across all storage providers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedConfig} onValueChange={setSelectedConfig}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by config" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Configurations</SelectItem>
              {configurations.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStorageType} onValueChange={setSelectedStorageType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by storage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Storage Types</SelectItem>
              <SelectItem value="vercel_blob">Vercel Blob</SelectItem>
              <SelectItem value="s3">AWS S3</SelectItem>
              <SelectItem value="gcs" disabled>Google Cloud</SelectItem>
              <SelectItem value="azure_blob" disabled>Azure Blob</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Files grouped by storage type */}
        {Object.keys(groupedFiles).length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No files found</p>
          </div>
        ) : (
          <Tabs defaultValue={Object.keys(groupedFiles)[0]} className="space-y-4">
            <TabsList className="grid w-full grid-rows-auto">
              {Object.keys(groupedFiles).map((storageType) => (
                <TabsTrigger key={storageType} value={storageType} className="flex items-center gap-2">
                  {getStorageIcon(storageType)}
                  {getStorageLabel(storageType)}
                  <Badge variant="secondary" className="ml-1">
                    {groupedFiles[storageType].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedFiles).map(([storageType, storageFiles]) => (
              <TabsContent key={storageType} value={storageType}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Configuration</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storageFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getStorageIcon(file.storage_type)}
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{file.config_name || "Unknown"}</TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>
                            {(() => {
                            let badgeVariant: "default" | "secondary" | "destructive";
                            let badgeText: string;

                            if (file.status === "completed") {
                              badgeVariant = "default";
                              badgeText = "Completed";
                            } else if (file.status === "partially_completed") {
                              badgeVariant = "secondary";
                              badgeText = `${file.errorCount} errors`;
                            } else {
                              badgeVariant = "destructive";
                              badgeText = "Failed";
                            }

                            return (
                              <Badge variant={badgeVariant}>
                              {badgeText}
                              </Badge>
                            );
                            })()}
                        </TableCell>
                        <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => handleProperties(file)}>
                                    <Info className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View properties</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => handleView(file)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(file)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>

      {/* Modals */}
      <FileDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} file={selectedFile} />
      <FilePropertiesModal
        isOpen={isPropertiesModalOpen}
        onClose={() => setIsPropertiesModalOpen(false)}
        file={selectedFile}
      />
    </Card>
  )
}
