"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Info,
  Save,
  FileText,
  Download,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type KPI, kpiData } from "@/types/kpi-types"
import { simulateKPIChange } from "@/types/kpi-dependency-model"
import { DependencyGraph } from "./dependency-graph"
import { DependencyMatrix } from "./dependency-matrix"
import { CustomSlider } from "@/components/ui/custom-slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define a type for saved simulations
interface SavedSimulation {
  id: string
  name: string
  description: string
  date: string
  sourceKPI: string
  sourceKPIValue: number
  impactedKPIs: {
    id: string
    name: string
    originalValue: number
    newValue: number
    percentChange: number
    unit: string
  }[]
}

export function KPIDependencySimulator() {
  const [selectedKPI, setSelectedKPI] = useState<string>(kpiData[0].id)
  const [simulatedKPIs, setSimulatedKPIs] = useState<KPI[]>(kpiData)
  const [originalKPIs] = useState<KPI[]>(kpiData)
  const [sliderValue, setSliderValue] = useState<number[]>([kpiData[0].currentValue])
  const [isSimulating, setIsSimulating] = useState<boolean>(false)
  const [simulationStep, setSimulationStep] = useState<number>(0)
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1000) // ms

  // For saving simulations
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([])
  const [simulationName, setSimulationName] = useState<string>("")
  const [simulationDescription, setSimulationDescription] = useState<string>("")
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false)
  const [selectedSimulation, setSelectedSimulation] = useState<SavedSimulation | null>(null)

  // For smooth simulation
  const simulationTargetRef = useRef<number | null>(null)
  const simulationStartValueRef = useRef<number | null>(null)
  const simulationProgressRef = useRef<number>(0)
  const simulationStepsRef = useRef<number>(20) // Number of steps for smooth transition

  // Get the currently selected KPI
  const currentKPI = simulatedKPIs.find((kpi) => kpi.id === selectedKPI) || kpiData[0]

  // Calculate appropriate slider min, max values based on KPI type
  const calculateSliderRange = () => {
    const originalValue = originalKPIs.find((k) => k.id === selectedKPI)?.currentValue || currentKPI.currentValue

    // Different ranges based on KPI type and unit
    if (currentKPI.unit === "percentage") {
      // For percentage-based KPIs, range from 0% to 100%
      return {
        min: 0,
        max: 100,
        step: 0.5, // Half percent steps
        defaultValue: originalValue,
      }
    } else if (currentKPI.unit === "days") {
      // For day-based metrics, allow reasonable range
      const minDays = Math.max(1, originalValue * 0.5) // At least 1 day, or half current
      const maxDays = originalValue * 2 // Double the current value
      return {
        min: minDays,
        max: maxDays,
        step: 1, // Full day steps
        defaultValue: originalValue,
      }
    } else if (currentKPI.name.toLowerCase().includes("cost") || currentKPI.name.toLowerCase().includes("price")) {
      // For cost-related metrics
      const minCost = Math.max(0, originalValue * 0.5) // Half current, but not below 0
      const maxCost = originalValue * 1.5 // 50% increase
      return {
        min: minCost,
        max: maxCost,
        step: originalValue / 100, // 1% of original value
        defaultValue: originalValue,
      }
    } else if (currentKPI.name.toLowerCase().includes("turnover")) {
      // For turnover metrics
      const minTurnover = Math.max(1, originalValue * 0.5)
      const maxTurnover = originalValue * 2
      return {
        min: minTurnover,
        max: maxTurnover,
        step: 0.1, // Tenth steps
        defaultValue: originalValue,
      }
    } else {
      // Default case - 50% below to 50% above current value
      const min = Math.max(0.1, originalValue * 0.5)
      const max = originalValue * 1.5
      return {
        min,
        max,
        step: (max - min) / 100, // 100 steps across the range
        defaultValue: originalValue,
      }
    }
  }

  // Get slider range values
  const sliderRange = calculateSliderRange()
  const sliderMin = sliderRange.min
  const sliderMax = sliderRange.max
  const sliderStep = sliderRange.step

  // Handle KPI selection change
  const handleKPIChange = useCallback(
    (kpiId: string) => {
      setSelectedKPI(kpiId)
      const kpi = simulatedKPIs.find((k) => k.id === kpiId)
      if (kpi) {
        setSliderValue([kpi.currentValue])
      }
    },
    [simulatedKPIs],
  )

  // Handle slider value change with debounce
  const handleSliderChange = useCallback(
    (value: number[]) => {
      if (value.length === 0) return

      const newValue = value[0]
      setSliderValue([newValue])

      // Apply the change to the KPIs
      const updatedKPIs = simulateKPIChange(selectedKPI, Number(newValue.toFixed(1)), simulatedKPIs)
      setSimulatedKPIs(updatedKPIs)
    },
    [selectedKPI, simulatedKPIs],
  )

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsSimulating(false)
    setSimulationStep(0)
    setSimulatedKPIs([...originalKPIs])
    const kpi = originalKPIs.find((k) => k.id === selectedKPI)
    if (kpi) {
      setSliderValue([kpi.currentValue])
    }
    simulationTargetRef.current = null
    simulationStartValueRef.current = null
    simulationProgressRef.current = 0
  }, [originalKPIs, selectedKPI])

  // Start a smooth simulation
  const startSimulation = useCallback(() => {
    if (isSimulating) {
      setIsSimulating(false)
      return
    }

    // Set up the simulation parameters
    const currentValue = sliderValue[0]
    simulationStartValueRef.current = currentValue

    // Generate a target value that's significantly different from current
    const range = sliderMax - sliderMin
    // Choose a target that's at least 20% away from current value
    let targetValue
    do {
      targetValue = sliderMin + Math.random() * range
    } while (Math.abs(targetValue - currentValue) < range * 0.2)

    simulationTargetRef.current = targetValue
    simulationProgressRef.current = 0
    setIsSimulating(true)
  }, [isSimulating, sliderValue, sliderMin, sliderMax])

  // Run smooth simulation
  useEffect(() => {
    let simulationInterval: NodeJS.Timeout | null = null

    if (isSimulating) {
      simulationInterval = setInterval(() => {
        if (simulationTargetRef.current === null || simulationStartValueRef.current === null) {
          setIsSimulating(false)
          return
        }

        // Increment progress
        simulationProgressRef.current += 1 / simulationStepsRef.current

        if (simulationProgressRef.current >= 1) {
          // We've reached the target, set a new one
          simulationStartValueRef.current = simulationTargetRef.current

          // Generate a new target value
          const range = sliderMax - sliderMin
          const newTarget = sliderMin + Math.random() * range
          simulationTargetRef.current = newTarget
          simulationProgressRef.current = 0
        }

        // Calculate current value using easing function for smooth transition
        const progress = easeInOutCubic(simulationProgressRef.current)
        const startValue = simulationStartValueRef.current
        const targetValue = simulationTargetRef.current
        const currentValue = startValue + (targetValue - startValue) * progress

        // Update the slider and KPIs
        setSliderValue([currentValue])
        const updatedKPIs = simulateKPIChange(selectedKPI, Number(currentValue.toFixed(1)), simulatedKPIs)
        setSimulatedKPIs(updatedKPIs)
      }, 50) // Update more frequently for smoother animation
    }

    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval)
      }
    }
  }, [isSimulating, selectedKPI, simulatedKPIs, sliderMin, sliderMax])

  // Easing function for smooth transitions
  const easeInOutCubic = (x: number): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
  }

  // Calculate the impact summary
  const getImpactSummary = useCallback(() => {
    const changedKPIs = simulatedKPIs.filter((kpi) => {
      const originalKPI = originalKPIs.find((k) => k.id === kpi.id)
      if (!originalKPI) return false
      return Math.abs(kpi.currentValue - originalKPI.currentValue) > 0.1
    })

    return changedKPIs
      .map((kpi) => {
        const originalKPI = originalKPIs.find((k) => k.id === kpi.id)
        if (!originalKPI) return null

        const change = kpi.currentValue - originalKPI.currentValue
        const percentChange = (change / originalKPI.currentValue) * 100

        return {
          id: kpi.id,
          name: kpi.name,
          originalValue: originalKPI.currentValue,
          newValue: kpi.currentValue,
          change,
          percentChange,
          status: kpi.status,
          unit: kpi.unit,
        }
      })
      .filter(Boolean)
  }, [simulatedKPIs, originalKPIs])

  const impactSummary = getImpactSummary()

  // Save current simulation
  const saveSimulation = () => {
    if (!simulationName.trim()) {
      alert("Please provide a name for the simulation")
      return
    }

    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleString()

    const newSimulation: SavedSimulation = {
      id: Date.now().toString(),
      name: simulationName,
      description: simulationDescription,
      date: formattedDate,
      sourceKPI: currentKPI.name,
      sourceKPIValue: sliderValue[0],
      impactedKPIs: impactSummary.map((impact) => ({
        id: impact.id,
        name: impact.name,
        originalValue: impact.originalValue,
        newValue: impact.newValue,
        percentChange: impact.percentChange,
        unit: impact.unit,
      })),
    }

    setSavedSimulations((prev) => [...prev, newSimulation])
    setShowSaveDialog(false)
    setSimulationName("")
    setSimulationDescription("")
  }

  // Generate a report for a simulation
  const generateReport = (simulation: SavedSimulation) => {
    setSelectedSimulation(simulation)
    setShowReportDialog(true)
  }

  // Download report as PDF (simplified as text for now)
  const downloadReport = () => {
    if (!selectedSimulation) return

    // Create report content
    const reportContent = `
KPI SIMULATION REPORT
=====================
Name: ${selectedSimulation.name}
Date: ${selectedSimulation.date}
Description: ${selectedSimulation.description}

SOURCE KPI CHANGE
----------------
${selectedSimulation.sourceKPI}: ${selectedSimulation.sourceKPIValue.toFixed(1)}

IMPACT SUMMARY
-------------
${selectedSimulation.impactedKPIs
  .map(
    (kpi) =>
      `${kpi.name}: ${kpi.originalValue.toFixed(1)} → ${kpi.newValue.toFixed(1)} (${kpi.percentChange > 0 ? "+" : ""}${kpi.percentChange.toFixed(1)}%)`,
  )
  .join("\n")}

RECOMMENDATIONS
--------------
Based on this simulation, the following actions are recommended:
1. Implement changes to achieve the target value for ${selectedSimulation.sourceKPI}
2. Monitor the impact on ${selectedSimulation.impactedKPIs
      .filter((kpi) => Math.abs(kpi.percentChange) > 10)
      .map((kpi) => kpi.name)
      .join(", ")}
3. Develop mitigation strategies for any negative impacts
`

    // Create a blob and download link
    const blob = new Blob([reportContent], { type: "text/plain" })
    if(!blob){
      return;
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedSimulation.name.replace(/\s+/g, "_")}_report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KPI Dependency Simulator</CardTitle>
          <CardDescription>
            Simulate changes to KPIs and see how they affect other metrics in your supply chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Select KPI to Adjust</label>
                <Select value={selectedKPI} onValueChange={handleKPIChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header-continuous" disabled className="font-semibold">
                      Continuous Operations
                    </SelectItem>
                    {kpiData
                      .filter((kpi) => kpi.category === "continuous_operations")
                      .map((kpi) => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.name}
                        </SelectItem>
                      ))}
                    <SelectItem value="header-financial" disabled className="font-semibold">
                      Financial Optimization
                    </SelectItem>
                    {kpiData
                      .filter((kpi) => kpi.category === "financial_optimization")
                      .map((kpi) => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={resetSimulation} title="Reset Simulation">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant={isSimulating ? "destructive" : "default"}
                  size="icon"
                  onClick={startSimulation}
                  title={isSimulating ? "Pause Simulation" : "Run Automated Simulation"}
                >
                  {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSaveDialog(true)}
                  title="Save Simulation"
                  disabled={impactSummary.length === 0}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{currentKPI.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentKPI.description}</p>
                </div>
                <Badge
                  variant={
                    currentKPI.status === "on_target"
                      ? "default"
                      : currentKPI.status === "warning"
                        ? "outline"
                        : "destructive"
                  }
                >
                  {currentKPI.status === "on_target" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : currentKPI.status === "warning" ? (
                    <AlertTriangle className="mr-1 h-3 w-3" />
                  ) : (
                    <AlertTriangle className="mr-1 h-3 w-3" />
                  )}
                  {currentKPI.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Original:</span>
                  <span className="text-sm">
                    {originalKPIs.find((k) => k.id === selectedKPI)?.currentValue.toFixed(1)}
                    {currentKPI.unit === "percentage" ? "%" : currentKPI.unit === "days" ? " days" : ""}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Target:</span>
                  <span className="text-sm">
                    {currentKPI.targetValue.toFixed(1)}
                    {currentKPI.unit === "percentage" ? "%" : currentKPI.unit === "days" ? " days" : ""}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Current:</span>
                  <span className="text-sm font-bold">
                    {sliderValue[0].toFixed(1)}
                    {currentKPI.unit === "percentage" ? "%" : currentKPI.unit === "days" ? " days" : ""}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <div className="px-2 py-4">
                  <CustomSlider
                    value={sliderValue}
                    min={sliderMin}
                    max={sliderMax}
                    step={sliderStep}
                    onValueChange={handleSliderChange}
                    aria-label={`Adjust ${currentKPI.name} value`}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {sliderMin.toFixed(1)}
                    {currentKPI.unit === "percentage" ? "%" : currentKPI.unit === "days" ? " days" : ""}
                  </span>
                  <span>
                    Original: {originalKPIs.find((k) => k.id === selectedKPI)?.currentValue.toFixed(1)}
                    {currentKPI.unit === "percentage" ? "%" : currentKPI.unit === "days" ? " days" : ""}
                  </span>
                  <span>
                    {sliderMax.toFixed(1)}
                    {currentKPI.unit === "percentage" ? "%" : currentKPI.unit === "days" ? " days" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Impact Summary</h3>
              {impactSummary.length > 0 ? (
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {impactSummary.map((impact) => (
                    <Card key={impact.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{impact.name}</span>
                          <Badge
                            variant={
                              impact.status === "on_target"
                                ? "default"
                                : impact.status === "warning"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {impact.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {impact.originalValue.toFixed(1)}
                            {impact.unit === "percentage" ? "%" : impact.unit === "days" ? " days" : ""}
                          </span>
                          <div className="flex items-center">
                            {impact.percentChange > 0 ? (
                              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span>{Math.abs(impact.percentChange).toFixed(1)}%</span>
                          </div>
                          <span className="font-bold">
                            {impact.newValue.toFixed(1)}
                            {impact.unit === "percentage" ? "%" : impact.unit === "days" ? " days" : ""}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border rounded-md">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Adjust the KPI value to see the impact on other metrics
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {savedSimulations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Simulations</CardTitle>
            <CardDescription>View and analyze your saved simulation scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedSimulations.map((simulation) => (
                <Card key={simulation.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle>{simulation.name}</CardTitle>
                      <Badge variant="outline">{simulation.date}</Badge>
                    </div>
                    <CardDescription>{simulation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Source KPI: <span className="font-medium">{simulation.sourceKPI}</span>
                      </span>
                      <span>
                        Value: <span className="font-medium">{simulation.sourceKPIValue.toFixed(1)}</span>
                      </span>
                      <span>
                        Impacted KPIs: <span className="font-medium">{simulation.impactedKPIs.length}</span>
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={() => generateReport(simulation)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="graph" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graph">Graph View</TabsTrigger>
          <TabsTrigger value="matrix">Matrix View</TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI Dependency Graph</CardTitle>
              <CardDescription>Visualize relationships between KPIs</CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyGraph simulatedKPIs={simulatedKPIs} originalKPIs={originalKPIs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KPI Dependency Matrix</CardTitle>
              <CardDescription>View KPI relationships in a correlation matrix</CardDescription>
            </CardHeader>
            <CardContent>
              <DependencyMatrix />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Simulation Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Simulation</DialogTitle>
            <DialogDescription>Save this simulation scenario to reference later or generate reports</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="simulation-name">Simulation Name</Label>
              <Input
                id="simulation-name"
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                placeholder="e.g., Inventory Reduction Scenario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="simulation-description">Description</Label>
              <Input
                id="simulation-description"
                value={simulationDescription}
                onChange={(e) => setSimulationDescription(e.target.value)}
                placeholder="e.g., Simulating the impact of reducing inventory levels by 20%"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveSimulation}>Save Simulation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulation Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Simulation Report</DialogTitle>
            <DialogDescription>Detailed analysis of the simulation scenario</DialogDescription>
          </DialogHeader>
          {selectedSimulation && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{selectedSimulation.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSimulation.description}</p>
                  <p className="text-sm">Created: {selectedSimulation.date}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-md font-medium">Source KPI Change</h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{selectedSimulation.sourceKPI}</span>
                        <span className="font-bold">{selectedSimulation.sourceKPIValue.toFixed(1)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="text-md font-medium">Impact Summary</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {selectedSimulation.impactedKPIs.map((impact) => (
                      <Card key={impact.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{impact.name}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {impact.originalValue.toFixed(1)}
                              {impact.unit === "percentage" ? "%" : impact.unit === "days" ? " days" : ""}
                            </span>
                            <div className="flex items-center">
                              {impact.percentChange > 0 ? (
                                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                              )}
                              <span>{Math.abs(impact.percentChange).toFixed(1)}%</span>
                            </div>
                            <span className="font-bold">
                              {impact.newValue.toFixed(1)}
                              {impact.unit === "percentage" ? "%" : impact.unit === "days" ? " days" : ""}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-md font-medium">Recommendations</h4>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Implement changes to achieve the target value for {selectedSimulation.sourceKPI}</li>
                        <li>
                          Monitor the impact on{" "}
                          {selectedSimulation.impactedKPIs
                            .filter((kpi) => Math.abs(kpi.percentChange) > 10)
                            .map((kpi) => kpi.name)
                            .join(", ")}
                        </li>
                        <li>Develop mitigation strategies for any negative impacts</li>
                        <li>Create action plans with specific timelines and responsibilities</li>
                        <li>Set up regular review meetings to track progress</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Close
            </Button>
            <Button onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
