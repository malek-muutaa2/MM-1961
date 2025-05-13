import { kpiData, type KPI } from "./kpi-types"

// Define the types of relationships between KPIs
export type DependencyType = "positive" | "negative" | "complex" | "none" | "self"

// Define the structure of a dependency relationship
export interface DependencyRelationship {
  source: string
  target: string
  value: number // Correlation coefficient (-1 to 1)
  type: DependencyType
  description: string
  formula?: string // Optional mathematical formula for simulation
}

// Define the dependency matrix
export interface DependencyMatrix {
  kpis: KPI[]
  relationships: DependencyRelationship[]
}

// Generate the dependency matrix based on our KPI data
export const generateDependencyMatrix = (): DependencyMatrix => {
  // Define relationships between KPIs
  const relationships: DependencyRelationship[] = [
    // Continuous operations dependencies
    {
      source: "expiry-writeoffs",
      target: "inventory-accuracy",
      value: -0.75,
      type: "negative",
      description: "Higher expiry write-offs indicate lower inventory accuracy",
      formula: "target = target - (source_change * 0.75)",
    },
    {
      source: "inventory-accuracy",
      target: "stockout-rate",
      value: -0.85,
      type: "negative",
      description: "Higher inventory accuracy reduces stockout risk",
      formula: "target = target - (source_change * 0.85)",
    },
    {
      source: "stockout-rate",
      target: "order-fill-rate",
      value: -0.92,
      type: "negative",
      description: "Higher stockout rate reduces order fill rate",
      formula: "target = target - (source_change * 0.92)",
    },
    {
      source: "inventory-turnover",
      target: "days-of-supply",
      value: -0.88,
      type: "negative",
      description: "Higher inventory turnover reduces days of supply",
      formula: "target = target - (source_change * 0.88)",
    },
    {
      source: "days-of-supply",
      target: "expiry-writeoffs",
      value: 0.78,
      type: "positive",
      description: "Higher days of supply increases risk of expiry write-offs",
      formula: "target = target + (source_change * 0.78)",
    },

    // Financial optimization dependencies
    {
      source: "inventory-carrying-cost",
      target: "inventory-depreciation",
      value: 0.82,
      type: "positive",
      description: "Higher carrying costs correlate with higher depreciation",
      formula: "target = target + (source_change * 0.82)",
    },
    {
      source: "procurement-cost",
      target: "supplier-price-variance",
      value: 0.65,
      type: "positive",
      description: "Higher procurement costs often indicate higher price variance",
      formula: "target = target + (source_change * 0.65)",
    },
    {
      source: "cash-to-cash-cycle",
      target: "total-supply-chain-cost",
      value: 0.72,
      type: "positive",
      description: "Longer cash-to-cash cycle increases total supply chain costs",
      formula: "target = target + (source_change * 0.72)",
    },

    // Cross-category dependencies
    {
      source: "inventory-turnover",
      target: "inventory-carrying-cost",
      value: -0.8,
      type: "negative",
      description: "Higher inventory turnover reduces carrying costs",
      formula: "target = target - (source_change * 0.8)",
    },
    {
      source: "days-of-supply",
      target: "cash-to-cash-cycle",
      value: 0.85,
      type: "positive",
      description: "Higher days of supply increases cash-to-cash cycle time",
      formula: "target = target + (source_change * 0.85)",
    },
    {
      source: "stockout-rate",
      target: "total-supply-chain-cost",
      value: 0.68,
      type: "positive",
      description: "Higher stockout rate increases total supply chain costs",
      formula: "target = target + (source_change * 0.68)",
    },
    {
      source: "inventory-accuracy",
      target: "inventory-depreciation",
      value: -0.62,
      type: "negative",
      description: "Higher inventory accuracy reduces inventory depreciation",
      formula: "target = target - (source_change * 0.62)",
    },
    {
      source: "order-fill-rate",
      target: "cash-to-cash-cycle",
      value: -0.58,
      type: "negative",
      description: "Higher order fill rate reduces cash-to-cash cycle time",
      formula: "target = target - (source_change * 0.58)",
    },
    {
      source: "inventory-turnover",
      target: "expiry-writeoffs",
      value: -0.71,
      type: "negative",
      description: "Higher inventory turnover reduces expiry write-offs",
      formula: "target = target - (source_change * 0.71)",
    },
  ]

  return {
    kpis: kpiData,
    relationships,
  }
}

// Get all dependencies for a specific KPI
export const getDependenciesForKPI = (kpiId: string): DependencyRelationship[] => {
  const { relationships } = generateDependencyMatrix()
  return relationships.filter((rel) => rel.source === kpiId || rel.target === kpiId)
}

// Simulate the impact of changing a KPI value
export const simulateKPIChange = (sourceKpiId: string, newValue: number, originalKPIs: KPI[] = kpiData): KPI[] => {
  const { relationships } = generateDependencyMatrix()
  const updatedKPIs = [...originalKPIs]

  // Find the source KPI
  const sourceKPIIndex = updatedKPIs.findIndex((kpi) => kpi.id === sourceKpiId)
  if (sourceKPIIndex === -1) return updatedKPIs

  const sourceKPI = updatedKPIs[sourceKPIIndex]
  const originalValue = sourceKPI.currentValue
  const changeAmount = newValue - originalValue

  // Update the source KPI
  updatedKPIs[sourceKPIIndex] = {
    ...sourceKPI,
    currentValue: newValue,
    status: calculateKPIStatus(
      newValue,
      sourceKPI.targetValue,
      sourceKPI.warningThreshold,
      sourceKPI.criticalThreshold,
    ),
  }

  // Find all relationships where this KPI is the source
  const affectedRelationships = relationships.filter((rel) => rel.source === sourceKpiId)

  // Update all affected KPIs (first-order effects)
  affectedRelationships.forEach((relationship) => {
    const targetKPIIndex = updatedKPIs.findIndex((kpi) => kpi.id === relationship.target)
    if (targetKPIIndex === -1) return

    const targetKPI = updatedKPIs[targetKPIIndex]
    let newTargetValue = targetKPI.currentValue

    // Apply the relationship formula
    if (relationship.type === "positive") {
      // Positive correlation: if source increases, target increases
      newTargetValue += changeAmount * Math.abs(relationship.value)
    } else if (relationship.type === "negative") {
      // Negative correlation: if source increases, target decreases
      newTargetValue -= changeAmount * Math.abs(relationship.value)
    }

    // Ensure the value doesn't go below 0 for percentage-based KPIs
    if (targetKPI.unit === "percentage" && newTargetValue < 0) {
      newTargetValue = 0
    }

    // Update the target KPI
    updatedKPIs[targetKPIIndex] = {
      ...targetKPI,
      currentValue: Number(newTargetValue.toFixed(1)),
      status: calculateKPIStatus(
        newTargetValue,
        targetKPI.targetValue,
        targetKPI.warningThreshold,
        targetKPI.criticalThreshold,
      ),
    }
  })

  // TODO: Add second-order effects (cascade changes through the network)

  return updatedKPIs
}

// Helper function to calculate KPI status based on thresholds
function calculateKPIStatus(
  value: number,
  target: number,
  warningThreshold: number,
  criticalThreshold: number,
): "on_target" | "warning" | "critical" {
  // For KPIs where higher is better (like accuracy)
  if (target > warningThreshold) {
    if (value >= target) return "on_target"
    if (value >= warningThreshold) return "warning"
    return "critical"
  }
  // For KPIs where lower is better (like costs)
  else {
    if (value <= target) return "on_target"
    if (value <= warningThreshold) return "warning"
    return "critical"
  }
}
