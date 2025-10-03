"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KPISelectionForm } from "@/components/kpis/kpi-selection-form"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, AlertTriangle, Info, CheckCircle, Settings } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getKPIById } from "@/types/kpi-types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { KPIDataMapping } from "@/components/kpis/kpi-data-mapping"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function KPISelectionClientPage() {
  const [currentStep, setCurrentStep] = useState<"select" | "review" | "thresholds" | "complete">("select")
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"continuous" | "financial">("continuous")
  const [kpiThresholds, setKpiThresholds] = useState<
    Record<
      string,
      {
        targetValue: number
        warningThreshold: number
        criticalThreshold: number
      }
    >
  >({})
  const [mappedKPIs, setMappedKPIs] = useState<string[]>([])

  const handleKPIsSelected = (kpiIds: string[]) => {
    // Prevent unnecessary re-renders by checking if the selection has actually changed
    if (JSON.stringify(kpiIds) !== JSON.stringify(selectedKPIs)) {
      setSelectedKPIs(kpiIds)

      // Initialize thresholds for newly selected KPIs
      const newThresholds = { ...kpiThresholds }
      kpiIds.forEach((id) => {
        const kpi = getKPIById(id)
        if (kpi && !newThresholds[id]) {
          newThresholds[id] = {
            targetValue: kpi.targetValue,
            warningThreshold: kpi.warningThreshold,
            criticalThreshold: kpi.criticalThreshold,
          }
        }
      })
      setKpiThresholds(newThresholds)
    }
  }

  const handleNextStep = () => {
    if (currentStep === "select") {
      setCurrentStep("review")
    } else if (currentStep === "review") {
      setCurrentStep("thresholds")
    } else if (currentStep === "thresholds") {
      setCurrentStep("complete")
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === "review") {
      setCurrentStep("select")
    } else if (currentStep === "thresholds") {
      setCurrentStep("review")
    } else if (currentStep === "complete") {
      setCurrentStep("thresholds")
    }
  }

  const handleMappingComplete = (kpiId: string) => {
    setMappedKPIs((prev) => (prev.includes(kpiId) ? prev : [...prev, kpiId]))
  }

  const handleThresholdChange = (
    kpiId: string,
    type: "targetValue" | "warningThreshold" | "criticalThreshold",
    value: number,
  ) => {
    setKpiThresholds((prev) => ({
      ...prev,
      [kpiId]: {
        ...prev[kpiId],
        [type]: value,
      },
    }))
  }

  // Get data requirements for KPIs
  const getDataRequirements = (kpiId: string) => {
    const baseRequirements = [
      {
        source: "ERP System",
        fields: ["product_id", "quantity", "location_id", "timestamp"],
        required: true,
      },
    ]

    switch (kpiId) {
      case "expiry-writeoffs":
        return [
          ...baseRequirements,
          {
            source: "Inventory Management",
            fields: ["expiry_date", "batch_id", "write_off_amount", "reason_code"],
            required: true,
          },
        ]
      case "inventory-accuracy":
        return [
          ...baseRequirements,
          {
            source: "Inventory Management",
            fields: ["physical_count", "system_count", "variance", "count_date"],
            required: true,
          },
        ]
      case "stockout-rate":
        return [
          ...baseRequirements,
          {
            source: "Inventory Management",
            fields: ["out_of_stock_events", "total_sku_days", "demand_during_stockout"],
            required: true,
          },
          {
            source: "Procurement System",
            fields: ["order_date", "expected_delivery", "supplier_id"],
            required: false,
          },
        ]
      case "inventory-carrying-cost":
        return [
          ...baseRequirements,
          {
            source: "Financial System",
            fields: ["storage_cost", "insurance_cost", "capital_cost", "obsolescence_cost"],
            required: true,
          },
        ]
      default:
        return baseRequirements
    }
  }

  // Mock data availability for KPIs
  const getDataAvailability = (kpiId: string): "available" | "partial" | "unavailable" => {
    switch (kpiId) {
      case "expiry-writeoffs":
      case "inventory-accuracy":
      case "inventory-carrying-cost":
        return "available"
      case "stockout-rate":
      case "order-fill-rate":
      case "inventory-turnover":
      case "inventory-depreciation":
        return "partial"
      default:
        return "unavailable"
    }
  }

  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (currentStep) {
      case "select":
        return 25
      case "review":
        return 50
      case "thresholds":
        return 75
      case "complete":
        return 100
    }
  }
console.log("activeTab", activeTab);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Define Business Objectives & KPI Selection</h2>
      </div>

      {/* Progress indicator - updated for 4 steps */}
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "select" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}
            >
              1
            </div>
            <span
              className={`text-sm font-medium ${currentStep === "select" ? "text-primary" : "text-muted-foreground"}`}
            >
              Select KPIs
            </span>
          </div>
          <div className="h-0.5 flex-1 bg-muted self-center mx-2"></div>
          <div className="flex items-center gap-2">
            {(() => {
              let step2Class = "bg-muted text-muted-foreground"
              if (currentStep === "review") {
              step2Class = "bg-primary text-primary-foreground"
              } else if (currentStep === "thresholds" || currentStep === "complete") {
              step2Class = "bg-primary/20 text-primary"
              }
              return (
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step2Class}`}
              >
                2
              </div>
              )
            })()}
            <span
              className={`text-sm font-medium ${currentStep === "review" ? "text-primary" : "text-muted-foreground"}`}
            >
              Review & Map
            </span>
          </div>
          <div className="h-0.5 flex-1 bg-muted self-center mx-2"></div>
          <div className="flex items-center gap-2">
            {(() => {
              let step3Class = "bg-muted text-muted-foreground"
              if (currentStep === "thresholds") {
              step3Class = "bg-primary text-primary-foreground"
              } else if (currentStep === "complete") {
              step3Class = "bg-primary/20 text-primary"
              }
              return (
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${step3Class}`}
              >
                3
              </div>
              )
            })()}
            <span
              className={`text-sm font-medium ${currentStep === "thresholds" ? "text-primary" : "text-muted-foreground"}`}
            >
              Set Thresholds
            </span>
          </div>
          <div className="h-0.5 flex-1 bg-muted self-center mx-2"></div>
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "complete" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              4
            </div>
            <span
              className={`text-sm font-medium ${currentStep === "complete" ? "text-primary" : "text-muted-foreground"}`}
            >
              Complete
            </span>
          </div>
        </div>
        <Progress value={getProgressPercentage()} className="h-2" />
      </div>

      <div className="space-y-4">
        {currentStep === "select" && (
          <Card>
            <CardHeader>
              <CardTitle>Select KPI Category</CardTitle>
              <CardDescription>Choose the category that aligns with your business objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="continuous"
                className="w-full"
                onValueChange={(value) => setActiveTab(value as "continuous" | "financial")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="continuous">Continuous Operations</TabsTrigger>
                  <TabsTrigger value="financial">Financial Optimization</TabsTrigger>
                </TabsList>
                <TabsContent value="continuous" className="mt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>
                      Continuous Operations KPIs focus on maintaining optimal inventory levels, minimizing stockout
                      risks, and ensuring smooth day-to-day operations.
                    </p>
                  </div>
                  <KPISelectionForm
                    category="continuous_operations"
                    onKPIsSelected={handleKPIsSelected}
                    selectedKPIs={selectedKPIs}
                  />
                </TabsContent>
                <TabsContent value="financial" className="mt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>
                      Financial Optimization KPIs focus on reducing costs, optimizing capital allocation, and improving
                      financial efficiency in your supply chain.
                    </p>
                  </div>
                  <KPISelectionForm
                    category="financial_optimization"
                    onKPIsSelected={handleKPIsSelected}
                    selectedKPIs={selectedKPIs}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="help">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Help & Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <p className="text-sm font-medium">How to select the right KPIs:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Consider your business objectives and priorities</li>
                        <li>Check data availability for each KPI</li>
                        <li>Review industry benchmarks to understand performance targets</li>
                        <li>Start with a small set of KPIs (5-7) for focused improvement</li>
                        <li>Balance operational and financial metrics</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-between w-full">
                <Link href="/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                  </Button>
                </Link>
                <Button onClick={handleNextStep} disabled={selectedKPIs.length === 0}>
                  Review & Map Data <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {currentStep === "review" && (
          <Card>
            <CardHeader>
              <CardTitle>Review Selected KPIs & Map Data</CardTitle>
              <CardDescription>Configure data mapping for your selected KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Selected KPIs ({selectedKPIs.length})</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedKPIs.map((kpiId) => {
                      const kpi = getKPIById(kpiId)
                      if (!kpi) return null

                      const dataAvailability = getDataAvailability(kpi.id)
                      const isDataMapped = mappedKPIs.includes(kpi.id)
                      const canProceed = dataAvailability === "available" || isDataMapped

                      return (
                        <Card
                          key={kpiId}
                          className={`border ${canProceed ? "border-green-500/20" : "border-amber-500/20"}`}
                        >
                          <CardHeader className="py-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{kpi.name}</CardTitle>
                              <Badge variant={kpi.category === "continuous_operations" ? "default" : "secondary"}>
                                {kpi.category === "continuous_operations" ? "Operations" : "Financial"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            <p className="text-sm text-muted-foreground">{kpi.description}</p>

                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant={canProceed ? "default" : "outline"}
                                  className={canProceed ? "bg-green-500 hover:bg-green-500/80" : ""}
                                >
                                  {canProceed ? (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                  ) : (
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                  )}
                                  {canProceed ? "Data Ready" : "Data Mapping Required"}
                                </Badge>

                                <KPIDataMapping
                                  kpiId={kpi.id}
                                  name={kpi.name}
                                  dataRequirements={getDataRequirements(kpi.id)}
                                  dataAvailability={dataAvailability}
                                  onMappingComplete={() => handleMappingComplete(kpi.id)}
                                />
                              </div>

                              {isDataMapped && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span>Data mapping complete</span>
                                    <span className="font-medium">100%</span>
                                  </div>
                                  <Progress value={100} className="h-1" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Data Source Information</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Card>
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm">Connected Data Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="space-y-1">
                          <li className="text-xs flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            ERP System
                          </li>
                          <li className="text-xs flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            Inventory Management
                          </li>
                          <li className="text-xs flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            Financial System
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-sm">Missing Data Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="space-y-1">
                          <li className="text-xs flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                            Procurement System
                          </li>
                          <li className="text-xs flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                            Supplier Management
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Data mapping is required for some KPIs</p>
                      <p>
                        KPIs with partial or no data availability need data mapping before they can be fully activated.
                        Use the "Map Data" button to configure how your existing data maps to the required fields.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Selection
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={selectedKPIs.some((id) => {
                  const dataAvailability = getDataAvailability(id)
                  return dataAvailability !== "available" && !mappedKPIs.includes(id)
                })}
              >
                Set Thresholds <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === "thresholds" && (
          <Card>
            <CardHeader>
              <CardTitle>Set KPI Thresholds</CardTitle>
              <CardDescription>Configure target values and alert thresholds for your KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedKPIs.map((kpiId) => {
                  const kpi = getKPIById(kpiId)
                  if (!kpi) return null

                  const thresholds = kpiThresholds[kpiId] || {
                    targetValue: kpi.targetValue,
                    warningThreshold: kpi.warningThreshold,
                    criticalThreshold: kpi.criticalThreshold,
                  }

                  // Determine if this is a KPI where higher values are better or lower values are better
                  const higherIsBetter =
                    kpi.name.includes("Accuracy") || kpi.name.includes("Fill Rate") || kpi.name.includes("Turnover")

                  return (
                    <Card key={kpiId} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{kpi.name}</CardTitle>
                          <Badge variant={kpi.category === "continuous_operations" ? "default" : "secondary"}>
                            {kpi.category === "continuous_operations" ? "Operations" : "Financial"}
                          </Badge>
                        </div>
                        <CardDescription>{kpi.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Target Value</Label>
                              <span className="text-sm font-medium">
                                {thresholds.targetValue}
                                {kpi.unit === "percentage" ? "%" : ""} {kpi.unit === "days" ? " days" : ""}
                              </span>
                            </div>
                            <Slider
                              value={[thresholds.targetValue]}
                              min={0}
                              max={kpi.unit === "percentage" ? 100 : 365}
                              step={1}
                              onValueChange={(value) => handleThresholdChange(kpiId, "targetValue", value[0])}
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Warning Threshold</Label>
                              <span className="text-sm font-medium">
                                {thresholds.warningThreshold}
                                {(() => {
                                  if (kpi.unit === "percentage") return "%"
                                  if (kpi.unit === "days") return " days"
                                  return ""
                                })()}
                              </span>
                            </div>
                            <Slider
                              value={[thresholds.warningThreshold]}
                              min={0}
                              max={kpi.unit === "percentage" ? 100 : 365}
                              step={1}
                              onValueChange={(value) => handleThresholdChange(kpiId, "warningThreshold", value[0])}
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Critical Threshold</Label>
                              <span className="text-sm font-medium">
                                {thresholds.criticalThreshold}
                                {(() => {
                                  if (kpi.unit === "percentage") return "%"
                                  if (kpi.unit === "days") return " days"
                                  return ""
                                })()}
                              </span>
                            </div>
                            <Slider
                              value={[thresholds.criticalThreshold]}
                              min={0}
                              max={kpi.unit === "percentage" ? 100 : 365}
                              step={1}
                              onValueChange={(value) => handleThresholdChange(kpiId, "criticalThreshold", value[0])}
                            />
                          </div>
                        </div>

                        <div className="rounded-md bg-muted p-4">
                          <div className="text-sm font-medium mb-2">Threshold Visualization</div>
                          <div className="relative h-8 w-full rounded-md bg-background">
                            {higherIsBetter ? (
                              <>
                                <div
                                  className="absolute inset-y-0 left-0 bg-red-500 rounded-l-md"
                                  style={{ width: `${thresholds.criticalThreshold}%` }}
                                ></div>
                                <div
                                  className="absolute inset-y-0 bg-amber-500"
                                  style={{
                                    left: `${thresholds.criticalThreshold}%`,
                                    width: `${thresholds.warningThreshold - thresholds.criticalThreshold}%`,
                                  }}
                                ></div>
                                <div
                                  className="absolute inset-y-0 bg-green-500"
                                  style={{
                                    left: `${thresholds.warningThreshold}%`,
                                    width: `${100 - thresholds.warningThreshold}%`,
                                    borderTopRightRadius: "0.375rem",
                                    borderBottomRightRadius: "0.375rem",
                                  }}
                                ></div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="absolute inset-y-0 left-0 bg-green-500 rounded-l-md"
                                  style={{ width: `${thresholds.criticalThreshold}%` }}
                                ></div>
                                <div
                                  className="absolute inset-y-0 bg-amber-500"
                                  style={{
                                    left: `${thresholds.criticalThreshold}%`,
                                    width: `${thresholds.warningThreshold - thresholds.criticalThreshold}%`,
                                  }}
                                ></div>
                                <div
                                  className="absolute inset-y-0 bg-red-500"
                                  style={{
                                    left: `${thresholds.warningThreshold}%`,
                                    width: `${100 - thresholds.warningThreshold}%`,
                                    borderTopRightRadius: "0.375rem",
                                    borderBottomRightRadius: "0.375rem",
                                  }}
                                ></div>
                              </>
                            )}
                            <div
                              className="absolute inset-y-0 w-1 bg-blue-500 border-2 border-white"
                              style={{
                                left: `${thresholds.targetValue}%`,
                                transform: "translateX(-50%)",
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`alert-email-${kpiId}`}>Email Alerts</Label>
                            <div className="flex items-center space-x-2 mt-2">
                              <Input id={`alert-email-${kpiId}`} placeholder="email@example.com" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`refresh-frequency-${kpiId}`}>Refresh Frequency</Label>
                            <div className="flex items-center space-x-2 mt-2">
                              <select
                                id={`refresh-frequency-${kpiId}`}
                                defaultValue="daily"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Review
              </Button>
              <Button onClick={handleNextStep}>
                Finalize KPIs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === "complete" && (
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">KPI Configuration Complete!</CardTitle>
              <CardDescription>Your KPIs have been successfully configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    You've selected and configured{" "}
                    <span className="font-bold text-foreground">{selectedKPIs.length} KPIs</span> to track and monitor.
                    Your dashboard will be updated to reflect these selections.
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Settings className="h-4 w-4" /> View Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <p className="text-sm text-muted-foreground">
                        Go to your dashboard to see your selected KPIs in action
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link href="/dashboard" className="w-full">
                        <Button className="w-full">Go to Dashboard</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
