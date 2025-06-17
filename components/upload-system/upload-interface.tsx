"use client"

import type React from "react"

import {useState, useCallback, useRef} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Progress} from "@/components/ui/progress"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Badge} from "@/components/ui/badge"
import {Upload, FileText, AlertCircle, CheckCircle, X, Download} from "lucide-react"
import type {UploadConfiguration, UploadResponse} from "@/types/upload"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface UploadInterfaceProps {
    configurations: UploadConfiguration[]
}

export default function UploadInterface({configurations}: UploadInterfaceProps) {
    const [selectedConfig, setSelectedConfig] = useState<string>("")
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const selectedConfiguration = configurations.find((c) => c.id === Number(selectedConfig))

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0])
        }
    }, [])

    const handleFileSelection = (file: File) => {
        if (!selectedConfiguration) {
            alert("Please select a configuration first")
            return
        }

        // Validate file type
        const allowedTypes = selectedConfiguration.file_type.split(",").map((t) => t.trim())
        const fileExtension = file.name.split(".").pop()?.toLowerCase()

        if (!allowedTypes.includes(fileExtension || "")) {
            alert(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`)
            return
        }

        // Validate file size
        if (file.size > selectedConfiguration.max_file_size) {
            alert(`File too large. Maximum size: ${formatFileSize(selectedConfiguration.max_file_size)}`)
            return
        }

        setSelectedFile(file)
        setUploadResult(null)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedFile || !selectedConfiguration) return

        setUploading(true)
        setUploadProgress(0)

        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("config_id", String(selectedConfiguration.id))

        try {
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return prev + Math.random() * 10
                })
            }, 200)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            clearInterval(progressInterval)
            setUploadProgress(100)

            const result: UploadResponse = await response.json()
            setUploadResult(result)

            if (result.status === "success") {
                setSelectedFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            }
        } catch (error: any) {
            setUploadResult({
                status: "failed",
                error: {
                    code: "UPLOAD_ERROR",
                    message: "Failed to upload file",
                },
            })
        } finally {
            setUploading(false)
            setTimeout(() => setUploadProgress(0), 1000)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const clearFile = () => {
        setSelectedFile(null)
        setUploadResult(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }
    const handleDownloadTemplate = (config: UploadConfiguration) => {
        // Open the template download URL in a new tab
        window.open(`/api/configurations/${config.id}/template`, "_blank")
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                    <CardDescription>Upload files with validation and business rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Configuration Selection */}
                    <div className="w-full flex flex-row justify-center items-center gap-4">
                        <div className="w-full space-y-2 flex-2">
                            <label className="text-sm font-medium">Upload Configuration</label>
                            <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select  an upload  configuration "/>
                                </SelectTrigger>
                                <SelectContent>
                                    {configurations.map((config) => (
                                        <SelectItem key={config.id} value={String(config.id)}>
                                            <div className="flex flex-col">
                                                <span>{config.name}</span>
                                                <span
                                                    className="text-xs text-muted-foreground">{config.description}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedConfiguration ? (
                            <div className="space-y-2 items-center h-full justify-center mt-8">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm"
                                                    onClick={() => handleDownloadTemplate(selectedConfiguration)}>
                                                <Download className="h-8 w-8"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Download template file</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>) : ""
                        }
                    </div>

                    {/* Configuration Details */}
                    {selectedConfiguration && (
                        <Card className="bg-muted/50">
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">File Types:</span>
                                        <div className="flex gap-1 mt-1">
                                            {selectedConfiguration.file_type.split(",").map((type, i) => (
                                                <Badge key={i} variant="secondary">
                                                    {type.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Max Size:</span>
                                        <p className="text-muted-foreground">{formatFileSize(selectedConfiguration.max_file_size)}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Max Rows:</span>
                                        <p className="text-muted-foreground">{selectedConfiguration.max_rows || "Unlimited"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Delimiter:</span>
                                        <p className="text-muted-foreground">{selectedConfiguration.delimiter}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* File Drop Zone */}
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            dragActive
                                ? "border-primary bg-primary/5"
                                : selectedFile
                                    ? "border-green-500 bg-green-50"
                                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2">
                                    <FileText className="h-8 w-8 text-green-600"/>
                                    <div className="text-left">
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={clearFile} className="ml-auto">
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                                {!uploading && (
                                    <Button onClick={handleUpload} disabled={!selectedConfiguration}>
                                        Upload File
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Upload className="h-12 w-12 mx-auto text-muted-foreground"/>
                                <div>
                                    <p className="text-lg font-medium">
                                        {dragActive ? "Drop file here" : "Drag and drop your file here"}
                                    </p>
                                    <p className="text-muted-foreground">or</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={!selectedConfiguration}
                                    >
                                        Browse Files
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileInputChange}
                                        accept={selectedConfiguration?.file_type
                                            .split(",")
                                            .map((t) => `.${t.trim()}`)
                                            .join(",")}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span>{uploadProgress.toFixed(2)}%</span>
                            </div>
                            <Progress value={uploadProgress}/>
                        </div>
                    )}

                    {/* Upload Result */}
                    {uploadResult && (
                        <Alert
                            className={
                                uploadResult.status === "success"
                                    ? "border-green-500 bg-green-50"
                                    : uploadResult.status === "partially_completed"
                                        ? "border-yellow-500 bg-yellow-50"
                                        : "border-red-500 bg-red-50"
                            }
                        >
                            <div className="flex items-start gap-2">
                                {uploadResult.status === "success" ? (
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5"/>
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5"/>
                                )}
                                <div className="flex-1">
                                    <AlertDescription>
                                        {uploadResult.status === "success" && (
                                            <span className="text-green-800">File uploaded successfully!</span>
                                        )}
                                        {uploadResult.status === "partially_completed" && (
                                            <span className="text-yellow-800">
                        File uploaded with {uploadResult.error?.details?.row_level_errors?.total} validation errors
                      </span>
                                        )}
                                        {uploadResult.status === "failed" && (
                                            <div className="text-red-800">
                                                <p className="font-medium">{uploadResult.error?.message}</p>
                                                {uploadResult.error?.details?.file_level_errors && (
                                                    <ul className="mt-2 space-y-1">
                                                        {uploadResult.error.details.file_level_errors.map((error, i) => (
                                                            <li key={i} className="text-sm">
                                                                • {error.message}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {uploadResult.error?.details?.row_level_errors && (
                                                    <div className="mt-2">
                                                        <p className="text-sm">
                                                            {uploadResult.error.details.row_level_errors.total} row
                                                            errors found
                                                        </p>
                                                        {uploadResult.error.details.row_level_errors.samples.length > 0 && (
                                                            <ul className="mt-1 space-y-1">
                                                                {uploadResult.error.details.row_level_errors.samples.slice(0, 3).map((error, i) => (
                                                                    <li key={i} className="text-sm">
                                                                        • Row {error.row}: {error.message}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </AlertDescription>
                                </div>
                            </div>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
