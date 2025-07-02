"use client"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {Download, Settings, AlertCircle, CheckCircle} from "lucide-react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import type {UploadConfiguration} from "@/types/upload"

interface ConfigurationSelectorProps {
    configurations: UploadConfiguration[]
    selectedConfigId: number | undefined
    onConfigurationSelect: (configId: number) => void
    onDownloadTemplate: (config: UploadConfiguration) => void
    uploading: boolean;
}

export default function ConfigurationSelector({
                                                  configurations,
                                                  selectedConfigId,
                                                  onConfigurationSelect,
                                                  onDownloadTemplate,
                                                  uploading
                                              }: Readonly<ConfigurationSelectorProps>) {
    const selectedConfiguration = configurations.find((c) => c.id === selectedConfigId)

    // console.log("selectedConfiguration", selectedConfiguration, selectedConfigId)
    // console.log("configurations", configurations)
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5"/>
                    Upload Configuration
                </CardTitle>
                <CardDescription>Select a configuration to define validation rules and file
                    requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Configuration Selection */}
                <div className="space-y-2" role="combobox">
                    <label className="text-sm font-medium">Choose Configuration</label>
                    <Select value={selectedConfigId ? String(selectedConfigId) : ""} onValueChange={(value: string) => {
                        localStorage.setItem("selectedConfiguration", value)

                        onConfigurationSelect(Number(value))
                    }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an upload configuration"/>
                        </SelectTrigger>
                        <SelectContent>

                            {configurations.map((config) => (
                                <SelectItem key={config.id} value={String(config.id)}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{config.name}</span>
                                        <span className="text-xs text-muted-foreground">{config.description}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Configuration Details */}
                {selectedConfiguration && (
                    <div className="space-y-4">
                        <Card className="bg-muted/50">
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    {/*<div>*/}
                                    {/*  <span className="font-medium">Organization:</span>*/}
                                    {/*  <p className="text-muted-foreground capitalize">*/}
                                    {/*    {selectedConfiguration.organization_type.replace("_", " ")}*/}
                                    {/*  </p>*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                    {/*  <span className="font-medium">Source Type:</span>*/}
                                    {/*  <p className="text-muted-foreground">{selectedConfiguration.source_type}</p>*/}
                                    {/*</div>*/}
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
                                        <p className="text-muted-foreground font-mono">{selectedConfiguration.delimiter}</p>
                                    </div>
                                </div>

                                {/* Validation Behavior */}
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        {selectedConfiguration.allow_partial_upload ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-600"/>
                                                <span className="text-sm font-medium text-green-700">Partial Upload Allowed</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="h-4 w-4 text-orange-600"/>
                                                <span className="text-sm font-medium text-orange-700">Strict Validation Required</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedConfiguration.allow_partial_upload
                                            ? "Files with validation errors will be uploaded with error details"
                                            : "Files must pass all validation checks before upload"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Template Download */}
                        <div className="flex justify-center">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            disabled={uploading}
                                            variant="outline"
                                            onClick={() => onDownloadTemplate(selectedConfiguration)}
                                            className="flex items-center gap-2"
                                        >
                                            <Download className="h-4 w-4"/>
                                            Download Template
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download a template file with the correct format and columns</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
