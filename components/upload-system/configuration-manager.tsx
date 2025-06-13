"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Settings, Edit, Download } from "lucide-react"
import type {
  UploadConfiguration,
  UploadConfigurationColumn,
  UploadStorageConfiguration,
  OrganizationType,
} from "@/types/upload"
import StorageConfigurationManager, {AWS_S3_REGIONS} from "./storage-configuration-manager"

interface ConfigurationManagerProps {
  configurations: UploadConfiguration[]
  storageConfigs: UploadStorageConfiguration[]
  organizationTypes: OrganizationType[]
  onSaveConfig: (config: Partial<UploadConfiguration>) => void
  onDeleteConfig: (id: string) => void
  onSaveStorage: (config: Partial<UploadStorageConfiguration>) => void
  onDeleteStorage: (id: string) => void
}

export default function ConfigurationManager({
  configurations,
  storageConfigs,
  organizationTypes,
  onSaveConfig,
  onDeleteConfig,
  onSaveStorage,
  onDeleteStorage,
}: ConfigurationManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<Partial<UploadConfiguration>>({})
  const [columns, setColumns] = useState<UploadConfigurationColumn[]>([])
  const [isEditing, setIsEditing] = useState(false)

  const selectedOrgType = organizationTypes?.find((org) => org.id === editingConfig.organization_type) ?? ""

  const file_types = [
    { code: "csv", name: "CSV", disabled: false },
    { code: "xlsx", name: "Excel (XLSX)", disabled: true },
    { code: "json", name: "JSON", disabled: true },
    { code: "xml", name: "XML", disabled: true },
  ]
  const handleEdit = (config: UploadConfiguration) => {
    setEditingConfig(config)
    // Fetch columns for this configuration
    fetchColumns(config.id)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const fetchColumns = async (configId: string) => {
    try {
      const response = await fetch(`/api/configurations/${configId}`)
      if (response.ok) {
        const data = await response.json()
        setColumns(data.columns || [])
      } else {
        console.error("Failed to fetch columns")
        setColumns([])
      }
    } catch (error) {
      console.error("Error fetching columns:", error)
      setColumns([])
    }
  }

  const handleAdd = () => {
    setEditingConfig({
      file_type: "csv",
      delimiter: ",",
      max_file_size: 10 * 1024 * 1024,
      active: true,
    })
    setColumns([])
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this configuration?")) {
      onDeleteConfig(id)
    }
  }

  const handleConfigChange = (field: keyof UploadConfiguration, value: any) => {
    setEditingConfig((prev) => ({ ...prev, [field]: value }))
  }

  const addColumn = () => {
    const newColumn: UploadConfigurationColumn = {
      id: crypto.randomUUID(),
      config_id: editingConfig.id || "",
      name: "",
      display_name: "",
      data_type: "string",
      required: false,
      position: columns.length,
    }
    setColumns((prev) => [...prev, newColumn])
  }

  const updateColumn = (index: number, field: keyof UploadConfigurationColumn, value: any) => {
    setColumns((prev) => prev.map((col, i) => (i === index ? { ...col, [field]: value } : col)))
  }

  const removeColumn = (index: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const configToSave = {
      ...editingConfig,
      columns,
    }
    onSaveConfig(configToSave)
    setIsDialogOpen(false)
    setEditingConfig({})
    setColumns([])
  }

  return (
    <div className="space-y-6">
      {/* Upload Configurations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Upload Configurations
          </CardTitle>
          <CardDescription>Manage upload configurations with validation rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Configuration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Upload Configuration" : "Add Upload Configuration"}</DialogTitle>
                  <DialogDescription>
                    Configure upload settings, validation rules, and column definitions
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                    <TabsTrigger value="columns">Column Configuration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Configuration Name</Label>
                          <Input
                            id="name"
                            value={editingConfig.name || ""}
                            onChange={(e) => handleConfigChange("name", e.target.value)}
                            placeholder="e.g., Customer Data Import"
                          />
                        </div>

                        <div>
                          <Label htmlFor="storage_config_id">Storage Configuration</Label>
                          <Select
                              value={editingConfig.storage_config_id || ""}
                              onValueChange={(value) => handleConfigChange("storage_config_id", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select storage configuration" />
                            </SelectTrigger>
                            <SelectContent>
                              {storageConfigs.map((storage) => (
                                  <SelectItem key={storage.id} value={storage.id}>
                                    <div className="flex flex-col">
                                      <span>{storage.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                      {storage.storage_type} - {storage.base_path}
                                    </span>
                                    </div>
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            rows={4}
                            cols={3}
                            value={editingConfig.description || ""}
                            onChange={(e) => handleConfigChange("description", e.target.value)}
                            placeholder="Describe what this configuration is for..."
                          />
                        </div>

                        {/*<div>*/}
                        {/*  <Label htmlFor="organization_type">Organization Type</Label>*/}
                        {/*  <Select*/}
                        {/*    value={editingConfig.organization_type || ""}*/}
                        {/*    onValueChange={(value) => handleConfigChange("organization_type", value)}*/}
                        {/*  >*/}
                        {/*    <SelectTrigger>*/}
                        {/*      <SelectValue placeholder="Select organization type" />*/}
                        {/*    </SelectTrigger>*/}
                        {/*    <SelectContent>*/}
                        {/*      {organizationTypes.map((orgType) => (*/}
                        {/*        <SelectItem key={orgType.id} value={orgType.id}>*/}
                        {/*          {orgType.name}*/}
                        {/*        </SelectItem>*/}
                        {/*      ))}*/}
                        {/*    </SelectContent>*/}
                        {/*  </Select>*/}
                        {/*</div>*/}

                        {/*<div>*/}
                        {/*  <Label htmlFor="source_type">Source Type</Label>*/}
                        {/*  <Select*/}
                        {/*    value={editingConfig.source_type || ""}*/}
                        {/*    onValueChange={(value) => handleConfigChange("source_type", value)}*/}
                        {/*    disabled={!selectedOrgType}*/}
                        {/*  >*/}
                        {/*    <SelectTrigger>*/}
                        {/*      <SelectValue placeholder="Select source type" />*/}
                        {/*    </SelectTrigger>*/}
                        {/*    <SelectContent>*/}
                        {/*      {selectedOrgType ? selectedOrgType?.source_types?.map((sourceType) => (*/}
                        {/*        <SelectItem key={sourceType} value={sourceType}>*/}
                        {/*          {sourceType}*/}
                        {/*        </SelectItem>*/}
                        {/*      )): ('')}*/}
                        {/*    </SelectContent>*/}
                        {/*  </Select>*/}
                        {/*</div>*/}

                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="file_type">Allowed File Types</Label>
                          <Select
                              value={editingConfig.file_type || ""}
                              onValueChange={(value) => handleConfigChange("file_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select File type"/>
                            </SelectTrigger>
                            <SelectContent>
                              {file_types
                                  .filter((type) => !type.disabled)
                                  .map((type) => (
                                  <SelectItem key={type.code} value={type.code}>
                                    {type.name}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {/*<Input*/}
                          {/*  id="file_type"*/}
                          {/*  value={editingConfig.file_type || ""}*/}
                          {/*  onChange={(e) => handleConfigChange("file_type", e.target.value)}*/}
                          {/*  placeholder="csv,xlsx"*/}
                          {/*/>*/}
                        </div>

                        <div>
                          <Label htmlFor="delimiter">Delimiter</Label>
                          <Select
                            value={editingConfig.delimiter || ""}
                            onValueChange={(value) => handleConfigChange("delimiter", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select delimiter" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=",">,</SelectItem>
                              <SelectItem value=";">;</SelectItem>
                              <SelectItem value="|">|</SelectItem>
                              <SelectItem value="\t">Tab</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="max_file_size">Max File Size (MB)</Label>
                          <Input
                            id="max_file_size"
                            type="number"
                            value={editingConfig.max_file_size ? editingConfig.max_file_size / (1024 * 1024) : ""}
                            onChange={(e) =>
                              handleConfigChange("max_file_size", Number.parseInt(e.target.value) * 1024 * 1024)
                            }
                            placeholder="10"
                          />
                        </div>

                        <div>
                          <Label htmlFor="max_rows">Max Rows (optional)</Label>
                          <Input
                            id="max_rows"
                            type="number"
                            value={editingConfig.max_rows || ""}
                            onChange={(e) =>
                              handleConfigChange("max_rows", Number.parseInt(e.target.value) || undefined)
                            }
                            placeholder="Leave empty for unlimited"
                          />
                        </div>

                        {/*<div className="flex items-center space-x-2">*/}
                        {/*  <Switch*/}
                        {/*    id="active"*/}
                        {/*    checked={editingConfig.active || false}*/}
                        {/*    onCheckedChange={(checked) => handleConfigChange("active", checked)}*/}
                        {/*  />*/}
                        {/*  <Label htmlFor="active">Active Configuration</Label>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="columns" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Column Definitions</h3>
                      <Button onClick={addColumn} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Column
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {columns.map((column, index) => (
                        <Card key={column.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <Label>Column Name</Label>
                              <Input
                                value={column.name}
                                onChange={(e) => updateColumn(index, "name", e.target.value)}
                                placeholder="name"
                              />
                            </div>
                            <div>
                              <Label>Display Name</Label>
                              <Input
                                value={column.display_name}
                                onChange={(e) => updateColumn(index, "display_name", e.target.value)}
                                placeholder="Display Name"
                              />
                            </div>
                            <div>
                              <Label>Data Type</Label>
                              <Select
                                value={column.data_type}
                                onValueChange={(value) => updateColumn(index, "data_type", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="string">String</SelectItem>
                                  <SelectItem value="number">Number</SelectItem>
                                  <SelectItem value="date">Date</SelectItem>
                                  <SelectItem value="boolean">Boolean</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={column.required}
                                  onCheckedChange={(checked) => updateColumn(index, "required", checked)}
                                />
                                <Label className="text-sm">Required</Label>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => removeColumn(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Advanced validation options */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                            {column.data_type === "string" && (
                              <>
                                <div>
                                  <Label>Min Length</Label>
                                  <Input
                                    type="number"
                                    value={column.min_length || ""}
                                    onChange={(e) =>
                                      updateColumn(index, "min_length", Number.parseInt(e.target.value) || undefined)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Max Length</Label>
                                  <Input
                                    type="number"
                                    value={column.max_length || ""}
                                    onChange={(e) =>
                                      updateColumn(index, "max_length", Number.parseInt(e.target.value) || undefined)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Pattern (Regex)</Label>
                                  <Input
                                    value={column.pattern || ""}
                                    onChange={(e) => updateColumn(index, "pattern", e.target.value)}
                                    placeholder="^[A-Z]{2,}$"
                                  />
                                </div>
                              </>
                            )}
                            {column.data_type === "number" && (
                              <>
                                <div>
                                  <Label>Min Value</Label>
                                  <Input
                                    type="number"
                                    value={column.min_value || ""}
                                    onChange={(e) =>
                                      updateColumn(index, "min_value", Number.parseFloat(e.target.value) || undefined)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label>Max Value</Label>
                                  <Input
                                    type="number"
                                    value={column.max_value || ""}
                                    onChange={(e) =>
                                      updateColumn(index, "max_value", Number.parseFloat(e.target.value) || undefined)
                                    }
                                  />
                                </div>
                              </>
                            )}
                          {/*  data type equal to Date add input string for format */}
                            {column.data_type === "date" && (
                                <>

                                  <div>
                                    <Label>Date Format</Label>
                                    <Input
                                        value={column.pattern || ""}
                                        onChange={(e) => updateColumn(index, "pattern", e.target.value)}
                                        placeholder="e.g., YYYY-MM-DD"
                                    />
                                  </div>
                                </>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-6 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>{isEditing ? "Update" : "Create"} Configuration</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {configurations.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No configurations yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {/*<TableHead>Organization</TableHead>*/}
                  {/*<TableHead>Source Type</TableHead>*/}
                  <TableHead>File Types</TableHead>
                  {/*<TableHead>Status</TableHead>*/}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configurations.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </TableCell>
                    {/*<TableCell>*/}
                    {/*  {organizationTypes.find((org) => org.id === config.organization_type)?.name ||*/}
                    {/*    config.organization_type}*/}
                    {/*</TableCell>*/}
                    {/*<TableCell>{config.source_type}</TableCell>*/}
                    <TableCell>{config.file_type}</TableCell>
                    {/*<TableCell>*/}
                    {/*  <span*/}
                    {/*    className={`px-2 py-1 rounded-full text-xs ${*/}
                    {/*      config.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"*/}
                    {/*    }`}*/}
                    {/*  >*/}
                    {/*    {config.active ? "Active" : "Inactive"}*/}
                    {/*  </span>*/}
                    {/*</TableCell>*/}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(config.id)}>
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
      </Card>

      {/* Storage Configurations */}
      <StorageConfigurationManager storageConfigs={storageConfigs} onSave={onSaveStorage} onDelete={onDeleteStorage} />
    </div>
  )
}
