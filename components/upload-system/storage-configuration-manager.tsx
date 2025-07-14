"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Plus, Edit, Trash2, Database, Info} from "lucide-react"
import type {UploadStorageConfiguration} from "@/types/upload"
import {AWS_S3_REGIONS} from "@/lib/storage/aws-s3";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface StorageConfigurationManagerProps {
    storageConfigs: UploadStorageConfiguration[]
    onSave: (config: Partial<UploadStorageConfiguration>) => void
    onDelete: (id: number) => void
}
// List of AWS S3 Regions
export default function StorageConfigurationManager({
                                                        storageConfigs,
                                                        onSave,
                                                        onDelete,
                                                    }: Readonly<StorageConfigurationManagerProps>) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState<Partial<UploadStorageConfiguration>>({})
    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = (config: UploadStorageConfiguration) => {
        setEditingConfig(config)
        setIsEditing(true)
        setIsDialogOpen(true)
    }

    const handleAdd = () => {
        setEditingConfig({
            storage_type: "s3",
            base_path: "uploads",
            path_template: "{base_path}/{year}-{month}/{uuid}.{ext}",
            access_type: "public",
        })
        setIsEditing(false)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        onSave(editingConfig)
        setIsDialogOpen(false)
        setEditingConfig({})
    }

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this storage configuration?")) {
            onDelete(id)
        }
    }

    const handleConfigChange = (field: keyof UploadStorageConfiguration, value: any) => {
        setEditingConfig((prev) => ({...prev, [field]: value}))
    }

    const getPlaceholderText = (storageType: string) => {
        switch (storageType) {
            // editingConfig.storage_type === "vercel_blob"
            //                                                     ? "Auto-managed"
            //                                                     : editingConfig.storage_type === "azure_blob"
            //                                                         ? "uploads"
            //                                                         : "my-upload-bucket"
            case "s3":
                return "e.g., my-bucket-name"
            case "gcs":
                return "e.g., my-gcs-bucket"
            case "azure_blob":
                return "e.g., my-container-name"
            case "vercel_blob":
                return "Optional for Vercel Blob"
            case "local":
                return "e.g., local-storage-path"
            default:
                return ""
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5"/>
                    Storage Configurations
                </CardTitle>
                <CardDescription>Manage storage backends for file uploads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAdd}>
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Storage Configuration
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{isEditing ? "Edit Storage Configuration" : "Add Storage Configuration"}</DialogTitle>
                                <DialogDescription>Configure storage backend settings for file
                                    uploads</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Configuration Name</Label>
                                        <Input
                                            id="name"
                                            value={editingConfig.name ?? ""}
                                            onChange={(e) => handleConfigChange("name", e.target.value)}
                                            placeholder="e.g., Production S3 Storage"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="storage_type">Storage Type</Label>
                                        <Select
                                            value={editingConfig.storage_type ?? ""}
                                            onValueChange={(value) => handleConfigChange("storage_type", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select storage type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="s3">Amazon S3</SelectItem>
                                                <SelectItem value="vercel_blob" disabled>Vercel Blob</SelectItem>
                                                <SelectItem value="gcs" disabled={true}>Google Cloud Storage</SelectItem>
                                                <SelectItem value="azure_blob" disabled={true}>Azure Blob Storage</SelectItem>
                                                <SelectItem value="local" disabled={true}>Local Storage</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={editingConfig.description ?? ""}
                                        onChange={(e) => handleConfigChange("description", e.target.value)}
                                        placeholder="Describe this storage configuration..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="bucket_name">
                                            {editingConfig.storage_type === "azure_blob" ? "Container Name" : "Bucket Name"}
                                            {editingConfig.storage_type === "vercel_blob" ? " (Optional)" : ""}
                                        </Label>
                                        <Input
                                            id="bucket_name"
                                            value={editingConfig.bucket_name ?? editingConfig.container_name ?? ""}
                                            onChange={(e) => {
                                                if (editingConfig.storage_type === "azure_blob") {
                                                    handleConfigChange("container_name", e.target.value)
                                                } else {
                                                    handleConfigChange("bucket_name", e.target.value)
                                                }
                                            }}
                                            placeholder={getPlaceholderText(editingConfig.storage_type ?? "")}
                                            disabled={editingConfig.storage_type === "vercel_blob"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="region">
                                            Region {editingConfig.storage_type === "vercel_blob" ? "(Auto-managed)" : ""}
                                        </Label>
                                        <Select
                                            value={editingConfig.region ?? "ca-central-1"}
                                            onValueChange={(value) => handleConfigChange("region", value)}
                                            disabled={editingConfig.storage_type === "vercel_blob"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Region type" defaultValue="ca-central-1"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AWS_S3_REGIONS.map((region) => (
                                                    <SelectItem key={region.code} value={region.code}>
                                                        {region.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/*<Input*/}
                                        {/*    id="region"*/}
                                        {/*    value={editingConfig.region ?? ""}*/}
                                        {/*    onChange={(e) => handleConfigChange("region", e.target.value)}*/}
                                        {/*    placeholder={editingConfig.storage_type === "vercel_blob" ? "Global CDN" : "us-east-1"}*/}
                                        {/*    disabled={editingConfig.storage_type === "vercel_blob"}*/}
                                        {/*/>*/}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="base_path">Base Path</Label>
                                        <Input
                                            id="base_path"
                                            value={editingConfig.base_path ?? ""}
                                            onChange={(e) => handleConfigChange("base_path", e.target.value)}
                                            placeholder="uploads/customer_data"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="path_template">
                                            <div className={"flex flex-row justify-start items-center gap-2"}>
                                                <p>Path Template</p>
                                            {/*    tooltip possibility info, using info icon*/}
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <Info className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Use the following placeholders in your path template:
                                                            </p>
                                                            <ul className="list-disc pl-5 mt-2 h-[100px] overflow-y-auto">
                                                                <li><code>{`{base_path}`}</code> - Base path for uploads</li>
                                                                <li><code>{`{organization_id}`}</code> - Organization ID (if applicable)</li>
                                                                <li><code>{`{user_id}`}</code> - User ID of the uploader</li>
                                                                <li><code>{`{year}`}</code> - Current year</li>
                                                                <li><code>{`{month}`}</code> - Current month (01-12)</li>
                                                                <li><code>{`{day}`}</code> - Current day (01-31)</li>
                                                                <li><code>{`{hour}`}</code> - Current hour (00-23)</li>
                                                                <li><code>{`{minute}`}</code> - Current minute (00-59)</li>
                                                                <li><code>{`{second}`}</code> - Current second (00-59)</li>
                                                                <li><code>{`{uuid}`}</code> - Unique identifier for the file</li>
                                                                <li><code>{`{timestamp}`}</code> - Unix timestamp of upload</li>
                                                                <li><code>{`{file_name}`}</code> - Original file name without extension</li>
                                                                <li><code>{`{ext}`}</code> - File extension</li>
                                                            </ul>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </Label>
                                        <Input
                                            id="path_template"
                                            value={editingConfig.path_template ?? ""}
                                            onChange={(e) => handleConfigChange("path_template", e.target.value)}
                                            placeholder="{base_path}/{year}-{month}/{uuid}.{ext}"
                                        />
                                    </div>
                                </div>

                                {editingConfig.storage_type === "s3" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                        <div className="col-span-2">
                                            <h4 className="font-medium mb-2">AWS Credentials</h4>
                                        </div>
                                        <div>
                                            <Label htmlFor="aws_access_key_id">AWS Access Key ID</Label>
                                            <Input
                                                id="aws_access_key_id"
                                                type="password"
                                                value={editingConfig.aws_access_key_id ?? ""}
                                                onChange={(e) => handleConfigChange("aws_access_key_id", e.target.value)}
                                                placeholder="AKIA..."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="aws_secret_access_key">AWS Secret Access Key</Label>
                                            <Input
                                                id="aws_secret_access_key"
                                                type="password"
                                                value={editingConfig.aws_secret_access_key ?? ""}
                                                onChange={(e) => handleConfigChange("aws_secret_access_key", e.target.value)}
                                                placeholder="Enter secret key"
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingConfig.storage_type === "gcs" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                        <div className="col-span-2">
                                            <h4 className="font-medium mb-2">Google Cloud Storage Credentials</h4>
                                        </div>
                                        <div>
                                            <Label htmlFor="gcs_project_id">Project ID</Label>
                                            <Input
                                                id="gcs_project_id"
                                                value={editingConfig.gcs_project_id ?? ""}
                                                onChange={(e) => handleConfigChange("gcs_project_id", e.target.value)}
                                                placeholder="my-project-id"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gcs_key_filename">Key Filename (Optional)</Label>
                                            <Input
                                                id="gcs_key_filename"
                                                value={editingConfig.gcs_key_filename ?? ""}
                                                onChange={(e) => handleConfigChange("gcs_key_filename", e.target.value)}
                                                placeholder="path/to/service-account.json"
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingConfig.storage_type === "azure_blob" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                        <div className="col-span-2">
                                            <h4 className="font-medium mb-2">Azure Blob Storage Credentials</h4>
                                        </div>
                                        <div>
                                            <Label htmlFor="azure_account_name">Account Name</Label>
                                            <Input
                                                id="azure_account_name"
                                                value={editingConfig.azure_account_name ?? ""}
                                                onChange={(e) => handleConfigChange("azure_account_name", e.target.value)}
                                                placeholder="mystorageaccount"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="azure_account_key">Account Key</Label>
                                            <Input
                                                id="azure_account_key"
                                                type="password"
                                                value={editingConfig.azure_account_key ?? ""}
                                                onChange={(e) => handleConfigChange("azure_account_key", e.target.value)}
                                                placeholder="Enter account key"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="container_name">Container Name</Label>
                                            <Input
                                                id="container_name"
                                                value={editingConfig.container_name ?? ""}
                                                onChange={(e) => handleConfigChange("container_name", e.target.value)}
                                                placeholder="uploads"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="azure_sas_token">SAS Token (Optional)</Label>
                                            <Input
                                                id="azure_sas_token"
                                                type="password"
                                                value={editingConfig.azure_sas_token ?? ""}
                                                onChange={(e) => handleConfigChange("azure_sas_token", e.target.value)}
                                                placeholder="?sv=2020-08-04&ss=..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {editingConfig.storage_type === "vercel_blob" && (
                                    <div>
                                        <Label htmlFor="access_type">Access Type</Label>
                                        <Select
                                            value={editingConfig.access_type ?? "public"}
                                            onValueChange={(value) => handleConfigChange("access_type", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}>{isEditing ? "Update" : "Create"} Configuration</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {storageConfigs.length === 0 ? (
                    <div className="text-center py-8">
                        <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                        <p className="text-muted-foreground">No storage configurations yet</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Bucket/Path</TableHead>
                                <TableHead>Region</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {storageConfigs.map((config) => (
                                <TableRow key={config.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{config.name}</p>
                                            <p className="text-sm text-muted-foreground">{config.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        className="capitalize">{config.storage_type.replace("_", " ")}</TableCell>
                                    <TableCell>
                                        {config.bucket_name ? `${config.bucket_name}/` : ""}
                                        {config.base_path}
                                    </TableCell>
                                    <TableCell>{config.region ?? "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(config.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
