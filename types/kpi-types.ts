// KPI Types for the MUUTAA.ML platform

export interface KPI {
  id: string
  name: string
  description: string
  category: "continuous_operations" | "financial_optimization"
  metric: string
  unit: string
  currentValue: number
  targetValue: number
  warningThreshold: number
  criticalThreshold: number
  confidenceScore: number
  isCustom: boolean
  trend: "increasing" | "decreasing" | "stable"
  trendValue: number
  status: "on_target" | "warning" | "critical"
}

// KPI data based on the provided CSV
export const kpiData: KPI[] = [
  // Continuous Operations KPIs
  {
    id: "expiry-writeoffs",
    name: "Expiry-Related Write-Offs",
    description: "Tracks the financial impact of expired products that must be written off",
    category: "continuous_operations",
    metric: "percentage_of_inventory_value",
    unit: "percentage",
    currentValue: 3.8,
    targetValue: 2.0,
    warningThreshold: 3.0,
    criticalThreshold: 5.0,
    confidenceScore: 92,
    isCustom: false,
    trend: "decreasing",
    trendValue: 0.5,
    status: "warning",
  },
  {
    id: "inventory-accuracy",
    name: "Inventory Accuracy",
    description: "Measures the accuracy of inventory records compared to physical counts",
    category: "continuous_operations",
    metric: "percentage_accuracy",
    unit: "percentage",
    currentValue: 94.2,
    targetValue: 98.0,
    warningThreshold: 95.0,
    criticalThreshold: 90.0,
    confidenceScore: 95,
    isCustom: false,
    trend: "increasing",
    trendValue: 1.2,
    status: "warning",
  },
  {
    id: "stockout-rate",
    name: "Stockout Rate",
    description: "Percentage of items that are out of stock when needed",
    category: "continuous_operations",
    metric: "percentage_of_items",
    unit: "percentage",
    currentValue: 4.5,
    targetValue: 2.0,
    warningThreshold: 4.0,
    criticalThreshold: 6.0,
    confidenceScore: 88,
    isCustom: false,
    trend: "decreasing",
    trendValue: 0.8,
    status: "warning",
  },
  {
    id: "order-fill-rate",
    name: "Order Fill Rate",
    description: "Percentage of orders that are filled completely on first attempt",
    category: "continuous_operations",
    metric: "percentage_of_orders",
    unit: "percentage",
    currentValue: 92.3,
    targetValue: 98.0,
    warningThreshold: 95.0,
    criticalThreshold: 90.0,
    confidenceScore: 90,
    isCustom: false,
    trend: "increasing",
    trendValue: 1.5,
    status: "warning",
  },
  {
    id: "inventory-turnover",
    name: "Inventory Turnover",
    description: "Number of times inventory is sold or used in a time period",
    category: "continuous_operations",
    metric: "turns_per_year",
    unit: "count",
    currentValue: 8.2,
    targetValue: 12.0,
    warningThreshold: 10.0,
    criticalThreshold: 6.0,
    confidenceScore: 85,
    isCustom: false,
    trend: "increasing",
    trendValue: 0.7,
    status: "warning",
  },
  {
    id: "days-of-supply",
    name: "Days of Supply",
    description: "Average number of days inventory lasts before needing replenishment",
    category: "continuous_operations",
    metric: "days",
    unit: "days",
    currentValue: 45.2,
    targetValue: 30.0,
    warningThreshold: 40.0,
    criticalThreshold: 60.0,
    confidenceScore: 87,
    isCustom: false,
    trend: "decreasing",
    trendValue: 2.3,
    status: "warning",
  },

  // Financial Optimization KPIs
  {
    id: "inventory-carrying-cost",
    name: "Inventory Carrying Cost",
    description: "Total cost of holding inventory including capital, storage, and risk costs",
    category: "financial_optimization",
    metric: "percentage_of_inventory_value",
    unit: "percentage",
    currentValue: 24.5,
    targetValue: 18.0,
    warningThreshold: 22.0,
    criticalThreshold: 28.0,
    confidenceScore: 89,
    isCustom: false,
    trend: "decreasing",
    trendValue: 1.2,
    status: "warning",
  },
  {
    id: "inventory-depreciation",
    name: "Financial Accounting & Inventory Depreciation",
    description: "Reduction in value of inventory over time due to obsolescence or market changes",
    category: "financial_optimization",
    metric: "percentage_of_inventory_value",
    unit: "percentage",
    currentValue: 5.8,
    targetValue: 3.0,
    warningThreshold: 5.0,
    criticalThreshold: 8.0,
    confidenceScore: 82,
    isCustom: false,
    trend: "decreasing",
    trendValue: 0.4,
    status: "warning",
  },
  {
    id: "procurement-cost",
    name: "Procurement Cost",
    description: "Total cost of procurement activities including ordering and receiving",
    category: "financial_optimization",
    metric: "percentage_of_purchase_value",
    unit: "percentage",
    currentValue: 3.2,
    targetValue: 2.0,
    warningThreshold: 3.0,
    criticalThreshold: 4.5,
    confidenceScore: 90,
    isCustom: false,
    trend: "decreasing",
    trendValue: 0.3,
    status: "warning",
  },
  {
    id: "supplier-price-variance",
    name: "Supplier Price Variance",
    description: "Difference between actual and standard/expected prices from suppliers",
    category: "financial_optimization",
    metric: "percentage_variance",
    unit: "percentage",
    currentValue: 4.7,
    targetValue: 2.0,
    warningThreshold: 4.0,
    criticalThreshold: 6.0,
    confidenceScore: 85,
    isCustom: false,
    trend: "decreasing",
    trendValue: 0.6,
    status: "warning",
  },
  {
    id: "cash-to-cash-cycle",
    name: "Cash-to-Cash Cycle Time",
    description: "Time between paying for inventory and receiving payment from customers",
    category: "financial_optimization",
    metric: "days",
    unit: "days",
    currentValue: 62.3,
    targetValue: 45.0,
    warningThreshold: 55.0,
    criticalThreshold: 70.0,
    confidenceScore: 88,
    isCustom: false,
    trend: "decreasing",
    trendValue: 3.1,
    status: "warning",
  },
  {
    id: "total-supply-chain-cost",
    name: "Total Supply Chain Cost",
    description: "Total cost of all supply chain activities as percentage of revenue",
    category: "financial_optimization",
    metric: "percentage_of_revenue",
    unit: "percentage",
    currentValue: 9.8,
    targetValue: 7.5,
    warningThreshold: 9.0,
    criticalThreshold: 12.0,
    confidenceScore: 92,
    isCustom: false,
    trend: "decreasing",
    trendValue: 0.5,
    status: "warning",
  },
]

// Get KPIs by category
export const getKPIsByCategory = (category: "continuous_operations" | "financial_optimization"): KPI[] => {
  return kpiData.filter((kpi) => kpi.category === category)
}

// Get KPI by ID
export const getKPIById = (id: string): KPI | undefined => {
  return kpiData.find((kpi) => kpi.id === id)
}

// Get KPI historical data (simulated)
export const getKPIHistoricalData = (kpiId: string, timeRange: "30d" | "90d" | "1y" = "90d") => {
  const kpi = getKPIById(kpiId)
  if (!kpi) return []

  // Generate simulated historical data based on current value and trend
  const dataPoints = timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
  const data = []

  // Start from current value and work backwards
  let value = kpi.currentValue
  const changePerDay = kpi.trendValue / 30 // Monthly trend divided by 30 days

  for (let i = 0; i < dataPoints; i++) {
    // Add some random noise to make the data more realistic
    const noise = (Math.random() - 0.5) * (kpi.trendValue / 2)

    // For older data points, reverse the trend
    value = value - (kpi.trend === "increasing" ? changePerDay : -changePerDay) + noise

    // Format date based on timeRange
    let date
    const today = new Date()
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - i)

    if (timeRange === "30d") {
      date = `${pastDate.getMonth() + 1}/${pastDate.getDate()}`
    } else if (timeRange === "90d") {
      date = `${pastDate.getMonth() + 1}/${pastDate.getDate()}`
    } else {
      date = `${pastDate.getMonth() + 1}/${pastDate.getDate()}/${pastDate.getFullYear()}`
    }

    data.unshift({
      date,
      value: Math.max(0, Number(value.toFixed(1))), // Ensure no negative values
      target: kpi.targetValue,
    })
  }

  return data
}

// Get KPI forecast data (simulated)
export const getKPIForecastData = (kpiId: string, days = 90) => {
  const kpi = getKPIById(kpiId)
  if (!kpi) return []

  const data = []
  let value = kpi.currentValue
  const changePerDay = kpi.trendValue / 30 // Monthly trend divided by 30 days

  // Add current value as actual
  const today = new Date()
  data.push({
    date: `${today.getMonth() + 1}/${today.getDate()}`,
    actual: value,
    forecast: null,
    lower: null,
    upper: null,
    target: kpi.targetValue,
  })

  // Generate forecast data
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + i)
    const date = `${futureDate.getMonth() + 1}/${futureDate.getDate()}`

    // Calculate forecast value based on trend
    value = value + (kpi.trend === "increasing" ? changePerDay : -changePerDay)

    // Add increasing uncertainty over time
    const uncertainty = (i / days) * (kpi.trendValue * 2)

    data.push({
      date,
      actual: null,
      forecast: Number(value.toFixed(1)),
      lower: Number((value - uncertainty).toFixed(1)),
      upper: Number((value + uncertainty).toFixed(1)),
      target: kpi.targetValue,
    })
  }

  return data
}
