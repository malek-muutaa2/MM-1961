export type ValidationIssue = {
  type: "error" | "warning"
  message: string
  column?: string
  row?: number
}

export type ForecastFile = {
  id: string
  providerId: string
  providerName: string
  fileName: string
  uploadDate: string
  forecastPeriod: string
  status: "submitted" | "not-submitted"
  validationIssues?: ValidationIssue[]
  year: number
  month: number
}

export type Provider = {
  id: string
  name: string
  contactName: string
  contactEmail: string
  contactPhone: string
  lastSubmission?: string
  submissionStatus: "on-time" | "late" | "missing" | "upcoming"
}

export type ForecastData = {
  productSku: string
  productName: string
  quantity: number
  unit: string
  category: string
}

export type Anomaly = {
  id: string
  providerId: string
  providerName: string
  productSku: string
  productName: string
  anomalyType: "spike" | "drop" | "trend-change" | "seasonality-change"
  severity: "low" | "medium" | "high"
  description: string
  detectedDate: string
}

export type Order = {
  id: string
  providerId: string
  providerName: string
  orderDate: string
  status: "pending" | "confirmed" | "sent-to-oracle" | "completed"
  totalProducts: number
  totalQuantity: number
}

export type ForecastDataPoint = {
  productId: string
  productName: string
  sku: string
  category: string
  forecastQuantity: number
  unit: string
  month: string
  year: number
}

// User management types
export type UserRole = "admin" | "provider" | "supplier" | "viewer"

export type UserStatus = "active" | "pending" | "inactive"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  organization: string
  createdAt: string
  lastLogin?: string
}

export type Invitation = {
  id: string
  email: string
  role: UserRole
  organization: string
  status: "pending" | "accepted" | "expired"
  createdAt: string
  expiresAt: string
  createdBy: string
}
