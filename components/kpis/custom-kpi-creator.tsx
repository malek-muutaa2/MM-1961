"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ArrowRight, Save } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataField {
  id: string
  name: string
  description: string
  dataType: string
  required: boolean
}

interface DataSource {
  id: string
  name: string
  fields: DataField[]
}

interface CustomKPICreatorProps {
  onKPICreated: (kpi: any) => void
}

export function CustomKPICreator({ onKPICreated }: CustomKPICreatorProps) {
  const [open, setOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [kpiData, setKpiData] = useState({
    name: "",
    description: "",
    category: "continuous_operations",
    unit: "percentage",
    targetValue: 95,
    warningThreshold: 90,
    criticalThreshold: 85,
    dataSources: [] as DataSource[],
    formula: "",
    refreshFrequency: "daily",
    benchmarks: [] as string[],
    notes: "",
  })

  // Available data sources
  const availableDataSources = [
    { id: "erp", name: "ERP System", connected: true },
    { id: "inventory", name: "Inventory Management", connected: true },
    { id: "procurement", name: "Procurement System", connected: false },
    { id: "financial", name: "Financial System", connected: true },
  ]

  // Available data fields per source
  const availableFields: Record<string, DataField[]> = {
    erp: [
      {
        id: "product_id",
        name: "Product ID",
        description: "Unique identifier for products",
        dataType: "string",
        required: false,
      },
      {
        id: "quantity",
        name: "Quantity",
        description: "Current quantity in inventory",
        dataType: "number",
        required: false,
      },
      {
        id: "location_id",
        name: "Location ID",
        description: "Warehouse or storage location",
        dataType: "string",
        required: false,
      },
      {
        id: "timestamp",
        name: "Timestamp",
        description: "Last update timestamp",
        dataType: "datetime",
        required: false,
      },
    ],
    inventory: [
      {
        id: "physical_count",
        name: "Physical Count",
        description: "Actual counted inventory",
        dataType: "number",
        required: false,
      },
      {
        id: "system_count",
        name: "System Count",
        description: "Inventory in system",
        dataType: "number",
        required: false,
      },
      {
        id: "expiry_date",
        name: "Expiry Date",
        description: "Product expiration date",
        dataType: "date",
        required: false,
      },
      {
        id: "batch_id",
        name: "Batch ID",
        description: "Production batch identifier",
        dataType: "string",
        required: false,
      },
    ],
    financial: [
      { id: "unit_cost", name: "Unit Cost", description: "Cost per unit", dataType: "currency", required: false },
      {
        id: "total_value",
        name: "Total Value",
        description: "Total inventory value",
        dataType: "currency",
        required: false,
      },
      {
        id: "storage_cost",
        name: "Storage Cost",
        description: "Cost of storage",
        dataType: "currency",
        required: false,
      },
      {
        id: "insurance_cost",
        name: "Insurance Cost",
        description: "Cost of insurance",
        dataType: "currency",
        required: false,
      },
    ],
    procurement: [
      { id: "order_date", name: "Order Date", description: "Date of order", dataType: "date", required: false },
      {
        id: "supplier_id",
        name: "Supplier ID",
        description: "Supplier identifier",
        dataType: "string",
        required: false,
      },
      { id: "lead_time", name: "Lead Time", description: "Order lead time", dataType: "number", required: false },
      {
        id: "order_quantity",
        name: "Order Quantity",
        description: "Quantity ordered",
        dataType: "number",
        required: false,
      },
    ],
  }

  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null)
  const [selectedFields, setSelectedFields] = useState<Record<string, DataField[]>>({})
  const [newBenchmark, setNewBenchmark] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleAddDataSource = () => {
    if (!selectedDataSource) return

    const source = availableDataSources.find((s) => s.id === selectedDataSource)
    if (!source) return

    // Check if already added
    if (kpiData.dataSources.some((s) => s.id === selectedDataSource)) {
      return
    }

    const fields = selectedFields[selectedDataSource] || []

    setKpiData({
      ...kpiData,
      dataSources: [
        ...kpiData.dataSources,
        {
          id: source.id,
          name: source.name,
          fields: fields,
        },
      ],
    })

    // Reset selection
    setSelectedDataSource(null)
  }

  const handleRemoveDataSource = (sourceId: string) => {
    setKpiData({
      ...kpiData,
      dataSources: kpiData.dataSources.filter((s) => s.id !== sourceId),
    })
  }

  const handleFieldToggle = (sourceId: string, field: DataField) => {
    const currentFields = selectedFields[sourceId] || []
    const fieldExists = currentFields.some((f) => f.id === field.id)

    if (fieldExists) {
      setSelectedFields({
        ...selectedFields,
        [sourceId]: currentFields.filter((f) => f.id !== field.id),
      })
    } else {
      setSelectedFields({
        ...selectedFields,
        [sourceId]: [...currentFields, field],
      })
    }
  }

  const handleAddBenchmark = () => {
    if (!newBenchmark.trim()) return

    setKpiData({
      ...kpiData,
      benchmarks: [...kpiData.benchmarks, newBenchmark],
    })

    setNewBenchmark("")
  }

  const handleRemoveBenchmark = (index: number) => {
    setKpiData({
      ...kpiData,
      benchmarks: kpiData.benchmarks.filter((_, i) => i !== index),
    })
  }

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!kpiData.name.trim()) {
        errors.name = "KPI name is required"
      }
      if (!kpiData.description.trim()) {
        errors.description = "Description is required"
      }
    }

    if (step === 2) {
      if (kpiData.dataSources.length === 0) {
        errors.dataSources = "At least one data source is required"
      }
      if (!kpiData.formula.trim()) {
        errors.formula = "Formula is required"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleFinish = () => {
    if (validateStep(activeStep)) {
      onKPICreated(kpiData)
      setOpen(false)
      // Reset form
      setKpiData({
        name: "",
        description: "",
        category: "continuous_operations",
        unit: "percentage",
        targetValue: 95,
        warningThreshold: 90,
        criticalThreshold: 85,
        dataSources: [],
        formula: "",
        refreshFrequency: "daily",
        benchmarks: [],
        notes: "",
      })
      setActiveStep(1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50 transition-colors">
          <Button variant="outline" className="h-auto flex flex-col p-4 gap-2">
            <Plus className="h-6 w-6" />
            <span>Add Custom KPI</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Create a custom KPI specific to your business needs
          </p>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Custom KPI</DialogTitle>
          <DialogDescription>Define a custom KPI tailored to your specific business requirements</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${activeStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <div className="h-1 w-12 bg-muted"></div>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${activeStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <div className="h-1 w-12 bg-muted"></div>
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${activeStep === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Step {activeStep} of 3</div>
          </div>

          {activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kpi-name">
                    KPI Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="kpi-name"
                    value={kpiData.name}
                    onChange={(e) => setKpiData({ ...kpiData, name: e.target.value })}
                    placeholder="e.g., Inventory Turnover Ratio"
                  />
                  {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi-description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="kpi-description"
                    value={kpiData.description}
                    onChange={(e) => setKpiData({ ...kpiData, description: e.target.value })}
                    placeholder="Describe what this KPI measures and why it's important"
                    rows={3}
                  />
                  {validationErrors.description && (
                    <p className="text-sm text-red-500">{validationErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-category">Category</Label>
                    <Select
                      value={kpiData.category}
                      onValueChange={(value) => setKpiData({ ...kpiData, category: value })}
                    >
                      <SelectTrigger id="kpi-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continuous_operations">Continuous Operations</SelectItem>
                        <SelectItem value="financial_optimization">Financial Optimization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpi-unit">Unit</Label>
                    <Select value={kpiData.unit} onValueChange={(value) => setKpiData({ ...kpiData, unit: value })}>
                      <SelectTrigger id="kpi-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="currency">Currency ($)</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="ratio">Ratio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Target Value</Label>
                      <span className="text-sm font-medium">
                        {kpiData.targetValue}
                        {kpiData.unit === "percentage" ? "%" : kpiData.unit === "days" ? " days" : ""}
                      </span>
                    </div>
                    <Slider
                      value={[kpiData.targetValue]}
                      min={0}
                      max={kpiData.unit === "percentage" ? 100 : 365}
                      step={1}
                      onValueChange={(value) => setKpiData({ ...kpiData, targetValue: value[0] })}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Warning Threshold</Label>
                      <span className="text-sm font-medium">
                        {kpiData.warningThreshold}
                        {kpiData.unit === "percentage" ? "%" : kpiData.unit === "days" ? " days" : ""}
                      </span>
                    </div>
                    <Slider
                      value={[kpiData.warningThreshold]}
                      min={0}
                      max={kpiData.unit === "percentage" ? 100 : 365}
                      step={1}
                      onValueChange={(value) => setKpiData({ ...kpiData, warningThreshold: value[0] })}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Critical Threshold</Label>
                      <span className="text-sm font-medium">
                        {kpiData.criticalThreshold}
                        {kpiData.unit === "percentage" ? "%" : kpiData.unit === "days" ? " days" : ""}
                      </span>
                    </div>
                    <Slider
                      value={[kpiData.criticalThreshold]}
                      min={0}
                      max={kpiData.unit === "percentage" ? 100 : 365}
                      step={1}
                      onValueChange={(value) => setKpiData({ ...kpiData, criticalThreshold: value[0] })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Configuration</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Data Sources <span className="text-red-500">*</span>
                  </Label>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Select value={selectedDataSource || ""} onValueChange={setSelectedDataSource}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDataSources.map((source) => (
                            <SelectItem
                              key={source.id}
                              value={source.id}
                              disabled={!source.connected || kpiData.dataSources.some((s) => s.id === source.id)}
                            >
                              {source.name} {!source.connected && "(Not Connected)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddDataSource} disabled={!selectedDataSource}>
                      Add Source
                    </Button>
                  </div>

                  {validationErrors.dataSources && (
                    <p className="text-sm text-red-500">{validationErrors.dataSources}</p>
                  )}

                  {selectedDataSource && (
                    <Card className="mt-2">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">
                          Select Fields from {availableDataSources.find((s) => s.id === selectedDataSource)?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <ScrollArea className="h-[150px]">
                          <div className="space-y-2">
                            {availableFields[selectedDataSource]?.map((field) => (
                              <div key={field.id} className="flex items-start space-x-2">
                                <Switch
                                  id={`field-${field.id}`}
                                  checked={selectedFields[selectedDataSource]?.some((f) => f.id === field.id) || false}
                                  onCheckedChange={() => handleFieldToggle(selectedDataSource, field)}
                                />
                                <div className="space-y-1">
                                  <Label htmlFor={`field-${field.id}`} className="text-sm font-medium">
                                    {field.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">{field.description}</p>
                                </div>
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {field.dataType}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {kpiData.dataSources.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Data Sources</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Source</TableHead>
                            <TableHead>Fields</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {kpiData.dataSources.map((source) => (
                            <TableRow key={source.id}>
                              <TableCell className="font-medium">{source.name}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {source.fields.map((field) => (
                                    <Badge key={field.id} variant="secondary" className="text-xs">
                                      {field.name}
                                    </Badge>
                                  ))}
                                  {source.fields.length === 0 && (
                                    <span className="text-xs text-muted-foreground">No fields selected</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveDataSource(source.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi-formula">
                    Calculation Formula <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="kpi-formula"
                    value={kpiData.formula}
                    onChange={(e) => setKpiData({ ...kpiData, formula: e.target.value })}
                    placeholder="e.g., (inventory_value / cost_of_goods_sold) * 365"
                    rows={3}
                  />
                  {validationErrors.formula && <p className="text-sm text-red-500">{validationErrors.formula}</p>}
                  <p className="text-xs text-muted-foreground">
                    Use field names from your selected data sources. Supported operators: +, -, *, /, (, )
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refresh-frequency">Refresh Frequency</Label>
                  <Select
                    value={kpiData.refreshFrequency}
                    onValueChange={(value) => setKpiData({ ...kpiData, refreshFrequency: value })}
                  >
                    <SelectTrigger id="refresh-frequency">
                      <SelectValue placeholder="Select refresh frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Industry Benchmarks</Label>

                  <div className="flex items-end gap-2">
                    <Input
                      value={newBenchmark}
                      onChange={(e) => setNewBenchmark(e.target.value)}
                      placeholder="e.g., Industry average: 95%"
                    />
                    <Button onClick={handleAddBenchmark}>Add</Button>
                  </div>

                  {kpiData.benchmarks.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {kpiData.benchmarks.map((benchmark, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="text-sm">{benchmark}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveBenchmark(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpi-notes">Additional Notes</Label>
                  <Textarea
                    id="kpi-notes"
                    value={kpiData.notes}
                    onChange={(e) => setKpiData({ ...kpiData, notes: e.target.value })}
                    placeholder="Any additional information about this KPI"
                    rows={3}
                  />
                </div>

                <Card className="bg-muted/50">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">KPI Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Name</h4>
                          <p className="text-sm">{kpiData.name || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Category</h4>
                          <p className="text-sm capitalize">{kpiData.category.replace("_", " ")}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Unit</h4>
                          <p className="text-sm capitalize">{kpiData.unit}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Target Value</h4>
                          <p className="text-sm">
                            {kpiData.targetValue}
                            {kpiData.unit === "percentage" ? "%" : kpiData.unit === "days" ? " days" : ""}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Data Sources</h4>
                          <p className="text-sm">{kpiData.dataSources.length} sources</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Refresh Frequency</h4>
                          <p className="text-sm capitalize">{kpiData.refreshFrequency}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Description</h4>
                        <p className="text-sm">{kpiData.description || "Not specified"}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Formula</h4>
                        <p className="text-sm font-mono bg-muted p-2 rounded-md">
                          {kpiData.formula || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {activeStep > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          )}

          {activeStep < 3 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish}>
              <Save className="mr-2 h-4 w-4" /> Create KPI
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
