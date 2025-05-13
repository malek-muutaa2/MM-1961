"use client"

import { useState, useEffect, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Database, CheckCircle, AlertTriangle } from "lucide-react"
import { getKPIsByCategory } from "@/types/kpi-types"
import { KPIInfoModal } from "./kpi-info-modal"
import { CustomKPICreator } from "./custom-kpi-creator"

interface KPISelectionFormProps {
  category: "continuous_operations" | "financial_optimization"
  onKPIsSelected?: (kpiIds: string[]) => void
  selectedKPIs?: string[]
}

export function KPISelectionForm({
  category,
  onKPIsSelected,
  selectedKPIs: externalSelectedKPIs = [],
}: KPISelectionFormProps) {
  // Get KPIs for the selected category
  const kpis = getKPIsByCategory(category)
  const [internalSelectedKPIs, setInternalSelectedKPIs] = useState<string[]>([])

  // Use a ref to track if we've initialized from props
  const initializedRef = useRef(false)

  // Only sync with external state on mount or when external selection explicitly changes
  useEffect(() => {
    if (!initializedRef.current || JSON.stringify(externalSelectedKPIs) !== JSON.stringify(internalSelectedKPIs)) {
      // Filter to only include KPIs from this category
      const categoryKpiIds = kpis.map((kpi) => kpi.id)
      const filteredSelection = externalSelectedKPIs.filter((id) => categoryKpiIds.includes(id))
      setInternalSelectedKPIs(filteredSelection)
      initializedRef.current = true
    }
  }, [externalSelectedKPIs, kpis])

  const handleKPIToggle = (kpiId: string) => {
    // Update internal state
    const newSelection = internalSelectedKPIs.includes(kpiId)
      ? internalSelectedKPIs.filter((id) => id !== kpiId)
      : [...internalSelectedKPIs, kpiId]

    setInternalSelectedKPIs(newSelection)

    // Notify parent component if callback provided
    if (onKPIsSelected) {
      // Get all selected KPIs from other categories that might be in the external state
      const otherCategoryKpis = externalSelectedKPIs.filter((id) => !kpis.map((k) => k.id).includes(id))
      onKPIsSelected([...otherCategoryKpis, ...newSelection])
    }
  }

  // Generate benchmark data for each KPI
  const getBenchmarkText = (kpiId: string) => {
    switch (kpiId) {
      case "expiry-writeoffs":
        return "Industry average: 2-3% of inventory value"
      case "inventory-accuracy":
        return "Industry best practice: >98%"
      case "stockout-rate":
        return "Industry average: <2% for critical items"
      case "order-fill-rate":
        return "Industry best practice: >98%"
      case "inventory-turnover":
        return "Industry average: 10-12 turns per year"
      case "days-of-supply":
        return "Industry average: 30-45 days"
      case "inventory-carrying-cost":
        return "Industry average: 18-22% of inventory value"
      case "inventory-depreciation":
        return "Industry average: 3-5% of inventory value"
      case "procurement-cost":
        return "Industry average: 2-3% of purchase value"
      case "supplier-price-variance":
        return "Industry best practice: <3%"
      case "cash-to-cash-cycle":
        return "Industry average: 45-60 days"
      case "total-supply-chain-cost":
        return "Industry average: 7-9% of revenue"
      default:
        return "No benchmark data available"
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

  // Get mock benchmarks for KPIs
  const getBenchmarks = (kpiId: string) => {
    switch (kpiId) {
      case "expiry-writeoffs":
        return [
          "Top performers: <1% of inventory value",
          "Industry average: 2-3% of inventory value",
          "Laggards: >5% of inventory value",
          "Healthcare sector average: 2.5% of inventory value",
          "Pharmaceutical sector average: 1.8% of inventory value",
        ]
      case "inventory-accuracy":
        return [
          "Top performers: >99.5% accuracy",
          "Industry best practice: >98% accuracy",
          "Industry average: 95-97% accuracy",
          "Laggards: <90% accuracy",
          "Retail sector average: 96.2% accuracy",
        ]
      default:
        return [
          "Industry best practice: Top quartile performance",
          "Industry average: Median performance",
          "Laggards: Bottom quartile performance",
        ]
    }
  }

  const handleCustomKPICreated = (newKpi: any) => {
    console.log("New KPI created:", newKpi)
    // In a real app, you would add this to your KPIs and select it
    const customKpiId = `custom-${Date.now()}`

    const newSelection = [...internalSelectedKPIs, customKpiId]
    setInternalSelectedKPIs(newSelection)

    // Notify parent component if callback provided
    if (onKPIsSelected) {
      // Get all selected KPIs from other categories that might be in the external state
      const otherCategoryKpis = externalSelectedKPIs.filter((id) => !kpis.map((k) => k.id).includes(id))
      onKPIsSelected([...otherCategoryKpis, ...newSelection])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {kpis.map((kpi) => {
          const dataAvailability = getDataAvailability(kpi.id)

          return (
            <Card key={kpi.id} className={`border ${internalSelectedKPIs.includes(kpi.id) ? "border-primary" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category}-${kpi.id}`}
                      checked={internalSelectedKPIs.includes(kpi.id)}
                      onCheckedChange={() => handleKPIToggle(kpi.id)}
                    />
                    <label
                      htmlFor={`${category}-${kpi.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {kpi.name}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        dataAvailability === "available"
                          ? "default"
                          : dataAvailability === "partial"
                            ? "warning"
                            : "secondary"
                      }
                      className={
                        dataAvailability === "available"
                          ? "bg-green-500 hover:bg-green-500/80"
                          : dataAvailability === "partial"
                            ? "bg-amber-500 hover:bg-amber-500/80"
                            : "bg-gray-400 hover:bg-gray-400/80"
                      }
                    >
                      {dataAvailability === "available" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : dataAvailability === "partial" ? (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      ) : (
                        <Database className="mr-1 h-3 w-3" />
                      )}
                      {dataAvailability === "available"
                        ? "Data Ready"
                        : dataAvailability === "partial"
                          ? "Partial Data"
                          : "No Data"}
                    </Badge>
                    <KPIInfoModal
                      kpiId={kpi.id}
                      name={kpi.name}
                      description={kpi.description}
                      dataRequirements={[]}
                      benchmarks={getBenchmarks(kpi.id)}
                      industry="Supply Chain"
                      confidenceScore={kpi.confidenceScore}
                      dataAvailability={dataAvailability}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{kpi.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                  <Badge variant="outline" className="text-xs">
                    {getBenchmarkText(kpi.id)}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          )
        })}

        <CustomKPICreator onKPICreated={handleCustomKPICreated} />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm">
          <span className="font-medium">{internalSelectedKPIs.length}</span> KPIs selected
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Data Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <span>Partial Data</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <span>No Data</span>
          </div>
        </div>
      </div>
    </div>
  )
}
