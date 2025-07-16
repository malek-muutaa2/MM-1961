"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KPIDataMappingProps {
  kpiId: string
  name: string
  dataRequirements: {
    source: string
    fields: string[]
    required: boolean
  }[]
  dataAvailability: "available" | "partial" | "unavailable"
  onMappingComplete: () => void
}

export function KPIDataMapping({
  kpiId,
  name,
  dataRequirements,
  dataAvailability,
  onMappingComplete,
}: Readonly<KPIDataMappingProps>) {
  const [open, setOpen] = useState(false)
  const [activeSource, setActiveSource] = useState<string | null>(
    dataRequirements.length > 0 ? dataRequirements[0].source : null,
  )

  // Mock data sources
  const availableDataSources = [
    { id: "erp", name: "ERP System", connected: true },
    { id: "inventory", name: "Inventory Management", connected: true },
    { id: "procurement", name: "Procurement System", connected: false },
    { id: "financial", name: "Financial System", connected: true },
  ]

  // Mock field mappings
  const [fieldMappings, setFieldMappings] = useState<Record<string, Record<string, string>>>({})

  const handleMappingComplete = () => {
    onMappingComplete()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Settings className="h-3.5 w-3.5" />
          Map Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Data Mapping for {name}</DialogTitle>
          <DialogDescription>Map your data sources to the required fields for this KPI</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="space-y-4">
            <div className="font-medium text-sm">Data Sources</div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {dataRequirements.map((req) => {
                  const dataSource = availableDataSources.find((ds) => ds.id === req.source.toLowerCase())
                  return (
                    <Card
                      key={req.source}
                      className={`cursor-pointer ${activeSource === req.source ? "border-primary" : ""}`}
                      onClick={() => setActiveSource(req.source)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{req.source}</div>
                          <div
                            className={`h-2 w-2 rounded-full ${dataSource?.connected ? "bg-green-500" : "bg-red-500"}`}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {req.required ? "Required" : "Optional"} • {req.fields.length} fields
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="col-span-2 border-l pl-4">
            {activeSource && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Field Mapping for {activeSource}</div>
                  <Button variant="outline" size="sm">
                    Auto Map
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {dataRequirements
                      .find((req) => req.source === activeSource)
                      ?.fields.map((field) => (
                        <div key={field} className="grid grid-cols-5 gap-4 items-center">
                          <div className="col-span-2">
                            <Label className="text-sm">{field}</Label>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="col-span-2">
                            <Select
                              value={fieldMappings[activeSource]?.[field] || ""}
                              onValueChange={(value) =>
                                setFieldMappings({
                                  ...fieldMappings,
                                  [activeSource]: {
                                    ...fieldMappings[activeSource],
                                    [field]: value,
                                  },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="field1">inventory_quantity</SelectItem>
                                <SelectItem value="field2">product_id</SelectItem>
                                <SelectItem value="field3">location_id</SelectItem>
                                <SelectItem value="field4">timestamp</SelectItem>
                                <SelectItem value="field5">unit_cost</SelectItem>
                                <SelectItem value="field6">expiry_date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}

                    <div className="pt-4">
                      <div className="font-medium text-sm mb-2">Custom Transformations</div>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <Label htmlFor="transform-name" className="text-xs">
                                  Name
                                </Label>
                                <Input id="transform-name" placeholder="e.g., Calculate Average" />
                              </div>
                              <div>
                                <Label htmlFor="transform-type" className="text-xs">
                                  Type
                                </Label>
                                <Select>
                                  <SelectTrigger id="transform-type">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="average">Average</SelectItem>
                                    <SelectItem value="sum">Sum</SelectItem>
                                    <SelectItem value="count">Count</SelectItem>
                                    <SelectItem value="custom">Custom Formula</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="transform-formula" className="text-xs">
                                Formula
                              </Label>
                              <Input id="transform-formula" placeholder="e.g., [field1] / [field2] * 100" />
                            </div>
                            <Button size="sm" className="w-full">
                              Add Transformation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Test Mapping</Button>
            <Button onClick={handleMappingComplete}>Save Mapping</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
