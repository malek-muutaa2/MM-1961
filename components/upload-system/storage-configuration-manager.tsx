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
import {Plus, Edit, Trash2, Database} from "lucide-react"
import type {UploadStorageConfiguration} from "@/types/upload"

interface StorageConfigurationManagerProps {
    storageConfigs: UploadStorageConfiguration[]
    onSave: (config: Partial<UploadStorageConfiguration>) => void
    onDelete: (id: string) => void
}

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
            storage_type: "vercel_blob",
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

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this storage configuration?")) {
            onDelete(id)
        }
    }

    const handleConfigChange = (field: keyof UploadStorageConfiguration, value: any) => {
        setEditingConfig((prev) => ({...prev, [field]: value}))
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
                                            value={editingConfig.name || ""}
                                            onChange={(e) => handleConfigChange("name", e.target.value)}
                                            placeholder="e.g., Production S3 Storage"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="storage_type">Storage Type</Label>
                                        <Select
                                            value={editingConfig.storage_type || ""}
                                            onValueChange={(value) => handleConfigChange("storage_type", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select storage type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vercel_blob">Vercel Blob</SelectItem>
                                                <SelectItem value="s3">Amazon S3</SelectItem>
                                                <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                                                <SelectItem value="azure_blob">Azure Blob Storage</SelectItem>
                                                <SelectItem value="local">Local Storage</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={editingConfig.description || ""}
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
                                            value={editingConfig.bucket_name || editingConfig.container_name || ""}
                                            onChange={(e) => {
                                                if (editingConfig.storage_type === "azure_blob") {
                                                    handleConfigChange("container_name", e.target.value)
                                                } else {
                                                    handleConfigChange("bucket_name", e.target.value)
                                                }
                                            }}
                                            placeholder={
                                                editingConfig.storage_type === "vercel_blob"
                                                    ? "Auto-managed"
                                                    : editingConfig.storage_type === "azure_blob"
                                                        ? "uploads"
                                                        : "my-upload-bucket"
                                            }
                                            disabled={editingConfig.storage_type === "vercel_blob"}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="region">
                                            Region {editingConfig.storage_type === "vercel_blob" ? "(Auto-managed)" : ""}
                                        </Label>
                                        <Input
                                            id="region"
                                            value={editingConfig.region || ""}
                                            onChange={(e) => handleConfigChange("region", e.target.value)}
                                            placeholder={editingConfig.storage_type === "vercel_blob" ? "Global CDN" : "us-east-1"}
                                            disabled={editingConfig.storage_type === "vercel_blob"}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="base_path">Base Path</Label>
                                        <Input
                                            id="base_path"
                                            value={editingConfig.base_path || ""}
                                            onChange={(e) => handleConfigChange("base_path", e.target.value)}
                                            placeholder="uploads/customer_data"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="path_template">Path Template</Label>
                                        <Input
                                            id="path_template"
                                            value={editingConfig.path_template || ""}
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
                                                value={editingConfig.aws_access_key_id || ""}
                                                onChange={(e) => handleConfigChange("aws_access_key_id", e.target.value)}
                                                placeholder="AKIA..."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="aws_secret_access_key">AWS Secret Access Key</Label>
                                            <Input
                                                id="aws_secret_access_key"
                                                type="password"
                                                value={editingConfig.aws_secret_access_key || ""}
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
                                                value={editingConfig.gcs_project_id || ""}
                                                onChange={(e) => handleConfigChange("gcs_project_id", e.target.value)}
                                                placeholder="my-project-id"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="gcs_key_filename">Key Filename (Optional)</Label>
                                            <Input
                                                id="gcs_key_filename"
                                                value={editingConfig.gcs_key_filename || ""}
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
                                                value={editingConfig.azure_account_name || ""}
                                                onChange={(e) => handleConfigChange("azure_account_name", e.target.value)}
                                                placeholder="mystorageaccount"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="azure_account_key">Account Key</Label>
                                            <Input
                                                id="azure_account_key"
                                                type="password"
                                                value={editingConfig.azure_account_key || ""}
                                                onChange={(e) => handleConfigChange("azure_account_key", e.target.value)}
                                                placeholder="Enter account key"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="container_name">Container Name</Label>
                                            <Input
                                                id="container_name"
                                                value={editingConfig.container_name || ""}
                                                onChange={(e) => handleConfigChange("container_name", e.target.value)}
                                                placeholder="uploads"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="azure_sas_token">SAS Token (Optional)</Label>
                                            <Input
                                                id="azure_sas_token"
                                                type="password"
                                                value={editingConfig.azure_sas_token || ""}
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
                                            value={editingConfig.access_type || "public"}
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
                                    <TableCell>{config.region || "N/A"}</TableCell>
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
