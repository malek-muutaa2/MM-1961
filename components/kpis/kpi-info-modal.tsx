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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Info, Database, CheckCircle, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KPIInfoModalProps {
  kpiId: string
  name: string
  description: string
  dataRequirements: {
    source: string
    fields: string[]
    required: boolean
  }[]
  benchmarks: string[]
  industry: string
  confidenceScore: number
  dataAvailability: "available" | "partial" | "unavailable"
}

export function KPIInfoModal({
  kpiId,
  name,
  description,
  dataRequirements,
  benchmarks,
  industry,
  confidenceScore,
  dataAvailability,
}: KPIInfoModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Info className="h-4 w-4" />
          <span className="sr-only">Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {name}
            <Badge
              variant={
                dataAvailability === "available" ? "default" : dataAvailability === "partial" ? "outline" : "secondary"
              }
              className="ml-2"
            >
              {dataAvailability === "available" ? (
                <CheckCircle className="mr-1 h-3 w-3" />
              ) : dataAvailability === "partial" ? (
                <AlertTriangle className="mr-1 h-3 w-3" />
              ) : (
                <Database className="mr-1 h-3 w-3" />
              )}
              {dataAvailability === "available"
                ? "Data Available"
                : dataAvailability === "partial"
                  ? "Partial Data"
                  : "Data Unavailable"}
            </Badge>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="data">Data Requirements</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4 pt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This KPI requires the following data sources and fields:
                </p>
                {dataRequirements.map((req, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{req.source}</div>
                        <Badge variant={req.required ? "destructive" : "outline"}>
                          {req.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">Fields needed:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {req.fields.map((field, i) => (
                          <Badge key={i} variant="secondary" className="justify-start">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-4 pt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Industry benchmarks for {name} in {industry}:
                </p>
                <ul className="space-y-2">
                  {benchmarks.map((benchmark, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{benchmark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Industry</div>
                    <div className="text-sm text-muted-foreground">{industry}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Data Confidence</div>
                    <div className="text-sm text-muted-foreground">{confidenceScore}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">KPI ID</div>
                    <div className="text-sm text-muted-foreground">{kpiId}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Data Availability</div>
                    <div className="text-sm text-muted-foreground capitalize">{dataAvailability}</div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium">Calculation Method</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    This KPI is calculated using a weighted average of the relevant metrics from the data sources. The
                    specific formula depends on the available data and industry standards.
                  </p>
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium">Recommended Actions</div>
                  <ul className="space-y-2 mt-1">
                    <li className="flex items-start space-x-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">
                        Connect all required data sources for optimal accuracy
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">
                        Set appropriate thresholds based on industry benchmarks
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Review this KPI weekly for best results</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button>Configure Data Mapping</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
