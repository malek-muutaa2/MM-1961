"use client"

import React, {useEffect, useState, useCallback, useRef} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Upload, FileText, AlertCircle, CheckCircle, X, AlertTriangle} from "lucide-react"
import ConfigurationSelector from "./configuration-selector"
import type {UploadConfiguration, UploadResponse, ValidationError} from "@/types/upload"
import {useToast} from "@/hooks/use-toast";

interface EnhancedUploadInterfaceProps {
    configurations: UploadConfiguration[]
}

export default function EnhancedUploadInterface({configurations}: Readonly<EnhancedUploadInterfaceProps>) {
    const [selectedConfig, setSelectedConfig] = useState<number>()
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadDuration, setUploadDuration] = useState<any>(null)
    const [selectedConfiguration, setSelectedConfiguration] = useState<UploadConfiguration | null | undefined>(configurations.find((c) => c.id === selectedConfig))
    // const selectedConfiguration = configurations.find((c) => c.id === selectedConfig)
    const {toast} = useToast();


    useEffect(() => {
        const initConfiguration = (typeof window !== "undefined" && localStorage.getItem("selectedConfiguration")) as string;
        if (!initConfiguration) {
            localStorage.setItem("selectedConfiguration", configurations[0]?.id.toString())
            setSelectedConfig(configurations[0]?.id)
            setSelectedConfiguration(configurations.find((c: any) => c.id === (selectedConfig ?? configurations[0]?.id)));
        } else {
            setSelectedConfig(Number(initConfiguration))
            setSelectedConfiguration(configurations.find((c: any) => c.id === (selectedConfig ?? Number(initConfiguration))));
        }
    }, [configurations, selectedConfig]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [selectedConfiguration])


    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files?.[0]) {
            // console.log( "rerfd", selectedConfig, selectedConfiguration)
            handleFileSelection(e.dataTransfer.files[0])
        }
    }, [selectedConfiguration])

    const handleFileSelection = (file: File) => {
        // console.log(selectedConfig, selectedConfiguration)
        if (!selectedConfiguration) {
            toast({
                title: "select a configuration",
                description: "Please select a configuration first",
                variant: 'destructive'
            })
            // alert("Please select a configuration first")
            return
        }

        // Validate file type
        const allowedTypes = selectedConfiguration.file_type.split(",").map((t) => t.trim())
        const fileExtension = file.name.split(".").pop()?.toLowerCase()

        if (!allowedTypes.includes(fileExtension ?? "")) {
            toast({
                title: "File types",
                description: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
                variant: 'destructive'
            })
            // alert(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`)
            return
        }

        // Validate file size
        if (selectedConfiguration?.max_file_size && file.size > selectedConfiguration?.max_file_size) {
            toast({
                title: "File too large",
                description: `File too large. Maximum size: ${formatFileSize(selectedConfiguration?.max_file_size)}`,
                variant: 'destructive'
            })
            // alert(`File too large. Maximum size: ${formatFileSize(selectedConfiguration.max_file_size)}`)
            return
        }

        setSelectedFile(file)
        setUploadResult(null)
        setValidationErrors([])
        setUploadDuration(null)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            console.log(selectedConfiguration)
            handleFileSelection(e.target.files[0])
        }
    }

    const handleUpload = async () => {

        if (!selectedFile || !selectedConfiguration) return

        clearFile()
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
                    return parseFloat((prev + Math.random() * 10).toFixed(2)) // NOSONAR
                })
            }, 200)

            const response = await fetch("/api/upload/enhanced", {
                method: "POST",
                body: formData,
            })

            clearInterval(progressInterval)
            setUploadProgress(100)

            const result: UploadResponse = await response.json()
            setUploadResult(result)

            // Extract validation errors for detailed display
            if (result.error?.details?.row_level_errors?.all_errors) {
                setValidationErrors(result.error.details.row_level_errors.all_errors)
            }

            if (result.status === "success") {
                setSelectedFile(null)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
            }
            setUploadDuration({
                started_at : result.started_at,
                completed_at: result.completed_at,
            })
        } catch (error) {
            console.log('Upload error:', error)
            setUploadResult({
                status: "failed",
                started_at : new Date(),
                completed_at: new Date(),
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

    const handleDownloadTemplate = (config: UploadConfiguration) => {
        window.open(`/api/configurations/${config.id}/template`, "_blank")
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
        setValidationErrors([])
        setUploadDuration(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const groupErrorsByType = (errors: ValidationError[]) => {
        return errors.reduce(
            (groups, error) => {
                const key = error.code
                if (!groups[key]) {
                    groups[key] = []
                }
                groups[key].push(error)
                return groups
            },
            {} as Record<string, ValidationError[]>,
        )
    }

    const getErrorSeverity = (errorCode: string) => {
        const criticalErrors = ["MISSING_REQUIRED_COLUMN", "MISSING_REQUIRED_VALUE", "INVALID_REQUIRED_VALUE", "EMPTY_FILE", "ROW_NOT_FOUND"]
        return criticalErrors.includes(errorCode) ? "critical" : "warning"
    }
    //
    //                                         uploadResult.status === "success"
    //                                             ? "border-green-500 bg-green-50"
    //                                             : uploadResult.status === "partially_completed"
    //                                                 ? "border-yellow-500 bg-yellow-50"
    //                                                 : "border-red-500 bg-red-50"
    //
    const getAlertClass = (status: string) => {
        switch (status) {
            case "success":
                return "border-green-500 bg-green-50"
            case "partially_completed":
                return "border-yellow-500 bg-yellow-50"
            case "failed":
                return "border-red-500 bg-red-50"
            case "default":
                return "border-muted-foreground/25 hover:border-muted-foreground/50"
            default:
                return "border-red-500 bg-red-50"
        }
    }
    const dropZoneClass = (dragActive: boolean, selectedFile: File | null) => {
        const baseClass = "border-2 border-dashed rounded-lg p-8 text-center transition-colors";
        if (dragActive) {
            return `${baseClass} border-primary bg-primary/5`;
        }else if( selectedFile) {
            return `${baseClass} border-green-500 bg-green-50`;
        }else {
            return `${baseClass} border-muted-foreground/25 hover:border-muted-foreground/50`;
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Configuration Selection */}
            <ConfigurationSelector
                configurations={configurations}
                selectedConfigId={selectedConfig}
                uploading={uploading}
                onConfigurationSelect={setSelectedConfig}
                onDownloadTemplate={handleDownloadTemplate}
            />

            {/* File Upload Section */}
            {selectedConfiguration && (
                <Card>
                    <CardHeader>
                        <CardTitle>File Upload</CardTitle>
                        <CardDescription>Upload your file for validation and processing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* File Drop Zone */}
                        <div
                            className={dropZoneClass(dragActive, selectedFile)}
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
                                    {!uploading && <Button
                                        disabled={uploading}
                                        onClick={handleUpload}>Upload File</Button>}
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
                                            disabled={uploading}
                                            variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            Browse Files
                                        </Button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileInputChange}
                                            accept={selectedConfiguration.file_type
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
                                    <span>Uploading and validating...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={parseFloat(uploadProgress.toFixed(2))}/>
                            </div>
                        )}
                        {/* display duration time in second or minute or hour here from  UploadDuration started_at and completed_at */}
                        {uploadDuration?.started_at && uploadDuration?.completed_at && (
                            <div className="text-sm text-muted-foreground">
                                Durée du traitement :{" "}
                                {(() => {
                                    const start = new Date(uploadDuration.started_at);
                                    const end = new Date(uploadDuration.completed_at);
                                    const diffMs = end.getTime() - start.getTime();
                                    const diffSec = Math.floor(diffMs / 1000);
                                    if (diffSec < 60) return `${diffSec} seconde${diffSec > 1 ? "s" : ""}`;
                                    const diffMin = Math.floor(diffSec / 60);
                                    if (diffMin < 60) {
                                        const remainingSeconds = diffSec % 60;
                                        let secondsPart = "";
                                        if (remainingSeconds) {
                                            secondsPart = `${remainingSeconds} seconde${remainingSeconds > 1 ? "s" : ""}`;
                                        }
                                        return `${diffMin} minute${diffMin > 1 ? "s" : ""} ${secondsPart}`;
                                    }
                                    const diffHour = Math.floor(diffMin / 60);
                                    const hourString = `${diffHour} heure${diffHour > 1 ? "s" : ""}`;
                                    let minuteString = "";
                                    if (diffMin % 60) {
                                        minuteString = `${diffMin % 60} minute${diffMin % 60 > 1 ? "s" : ""}`;
                                    }
                                    return `${hourString} ${minuteString}`;
                                })()}
                            </div>
                        )}

                        {/* Upload Result */}
                        {uploadResult && (
                            <div className="space-y-4">
                                <Alert className={getAlertClass(uploadResult.status)}>
                                    <div className="flex items-start gap-2">
                                        {uploadResult.status === "success" ? (
                                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5"/>
                                        ) : ""}
                                        {uploadResult.status === "partially_completed" ? (
                                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5"/>
                                        ) : (
                                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5"/>
                                        )}
                                        <div className="flex-1">
                                            <AlertDescription>
                                                {uploadResult.status === "success" && (
                                                    <div>
                                                        <span className="text-green-800 font-medium">File uploaded successfully!</span>
                                                        <p className="text-sm text-green-700 mt-1">
                                                            Processed {uploadResult.processed_rows} of {uploadResult.total_rows} rows
                                                        </p>
                                                    </div>
                                                )}
                                                {uploadResult.status === "partially_completed" && (
                                                    <div>
                                                        <span className="text-yellow-800 font-medium">File uploaded with validation errors</span>
                                                        <p className="text-sm text-yellow-700 mt-1">
                                                            Processed {uploadResult.processed_rows} of {uploadResult.total_rows} rows
                                                            (
                                                            {uploadResult.error?.details?.row_level_errors?.total} errors
                                                            found)
                                                        </p>
                                                    </div>
                                                )}
                                                {uploadResult.status === "failed" && (
                                                    <div>
                                                        <span
                                                            className="text-red-800 font-medium">{uploadResult.error?.message}</span>
                                                        {uploadResult.error?.details?.file_level_errors && (
                                                            <ul className="mt-2 space-y-1">
                                                                {uploadResult.error.details.file_level_errors
                                                                    .filter((x, idx) => idx < 20) // Limit to first 20 errors
                                                                    .map((error, i) => (
                                                                    <li key={`${i+1}`} className="text-sm text-red-700">
                                                                        • {error.message}
                                                                    </li>
                                                                ))}
                                                                {uploadResult.error.details.file_level_errors?.length > 20 ? `<br/>${uploadResult.error.details.file_level_errors?.length-20} restants...`: ""}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}
                                            </AlertDescription>
                                        </div>
                                    </div>
                                </Alert>

                                {/* Detailed Error Report */}
                                {validationErrors.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5 text-red-600"/>
                                                Validation Error Details
                                            </CardTitle>
                                            <CardDescription>{validationErrors.length} validation errors found in your
                                                file</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Tabs defaultValue="by-row" className="space-y-4">
                                                <TabsList>
                                                    <TabsTrigger value="by-row">By Row</TabsTrigger>
                                                    <TabsTrigger value="by-type">By Error Type</TabsTrigger>
                                                    <TabsTrigger value="summary">Summary</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="by-row">
                                                    <ScrollArea className="h-96">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Row</TableHead>
                                                                    <TableHead>Line</TableHead>
                                                                    <TableHead>Column</TableHead>
                                                                    <TableHead>Error</TableHead>
                                                                    <TableHead>Value</TableHead>
                                                                    <TableHead>Expected</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {validationErrors
                                                                    .toSorted((a, b) => (a?.row ?? 0) - (b?.row ?? 0))
                                                                    .map((error, index) => (
                                                                        <TableRow key={`${error.row ?? "no-row"}-${error.line ?? "no-line"}-${error.column ?? "no-col"}-${error.code}-${error.message}`}>
                                                                            <TableCell>{error.row ?? "-"}</TableCell>
                                                                            <TableCell>{error.line ?? "-"}</TableCell>
                                                                            <TableCell>
                                                                                {error.column && <Badge
                                                                                    variant="outline">{error.column}</Badge>}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <div
                                                                                    className="flex items-center gap-2">
                                                                                    <Badge
                                                                                        variant={
                                                                                            getErrorSeverity(error.code) === "critical" ? "destructive" : "secondary"
                                                                                        }
                                                                                    >
                                                                                        {error.code}
                                                                                    </Badge>
                                                                                    <span
                                                                                        className="text-sm">{error.message}</span>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <code
                                                                                    className="text-xs bg-muted px-1 py-0.5 rounded">
                                                                                    {error.value ?? "empty"}
                                                                                </code>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                className="text-xs text-muted-foreground">
                                                                                {error.expected_format}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </ScrollArea>
                                                </TabsContent>

                                                <TabsContent value="by-type">
                                                    <ScrollArea className="h-96">
                                                        <div className="space-y-4">
                                                            {Object.entries(groupErrorsByType(validationErrors)).map(([errorType, errors]) => (
                                                                <Card key={errorType}>
                                                                    <CardHeader className="pb-2">
                                                                        <CardTitle
                                                                            className="text-base flex items-center gap-2">
                                                                            <Badge
                                                                                variant={
                                                                                    getErrorSeverity(errorType) === "critical" ? "destructive" : "secondary"
                                                                                }
                                                                            >
                                                                                {errorType}
                                                                            </Badge>
                                                                            <span>{errors.length} occurrences</span>
                                                                        </CardTitle>
                                                                    </CardHeader>
                                                                    <CardContent>
                                                                        <div className="space-y-2">
                                                                            {errors.slice(0, 5).map((error, index) => (
                                                                                <div
                                                                                    key={`${errorType}-${error.row ?? "no-row"}-${error.column ?? "no-col"}-${error.code}-${error.message}`}
                                                                                    className="text-sm flex justify-between"
                                                                                >
                                          <span>
                                            Row {error.row}, Column {error.column}: {error.message}
                                          </span>
                                                                                    <code
                                                                                        className="text-xs bg-muted px-1 py-0.5 rounded">
                                                                                        {error.value ?? "empty"}
                                                                                    </code>
                                                                                </div>
                                                                            ))}
                                                                            {errors.length > 5 && (
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    ... and {errors.length - 5} more
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </TabsContent>

                                                <TabsContent value="summary">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <Card>
                                                            <CardContent className="pt-4">
                                                                <div className="text-2xl font-bold text-red-600">
                                                                    {validationErrors.filter((e) => getErrorSeverity(e.code) === "critical").length}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">Critical
                                                                    Errors</p>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardContent className="pt-4">
                                                                <div className="text-2xl font-bold text-yellow-600">
                                                                    {validationErrors.filter((e) => getErrorSeverity(e.code) === "warning").length}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">Warnings</p>
                                                            </CardContent>
                                                        </Card>
                                                        <Card>
                                                            <CardContent className="pt-4">
                                                                <div className="text-2xl font-bold">
                                                                    {new Set(validationErrors.map((e) => e.row)).size}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">Affected
                                                                    Rows</p>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
