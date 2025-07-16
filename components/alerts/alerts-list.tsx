"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Info, ArrowRight, ArrowUpDown, CheckCircle, Bell } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from "@/components/ui/pagination2"

interface Alert {
  id: number
  title: string
  description: string
  kpi: string
  severity: string
  timestamp: string
  isRead: boolean
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface AlertsResponse {
  alerts: Alert[]
  pagination: PaginationInfo
}

export function AlertsList({ filter = "all" }: Readonly<{ filter?: "all" | "critical" | "warning" | "info" }>) {
  const [sortField, setSortField] = useState<"severity" | "timestamp">("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch alerts from API
  const fetchAlerts = async (page = 1, limit = 10) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/alerts?page=${page}&limit=${limit}`)
      if (!response.ok) {
        throw new Error("Failed to fetch alerts")
      }
      const data: AlertsResponse = await response.json()
      setAlerts(data.alerts)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts(1, 10)
  }, [])

  // Filter alerts based on selected filter
  const filteredAlerts = filter === "all" ? alerts : alerts.filter((alert) => alert.severity === filter)

  // Sort alerts based on selected sort field and direction
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortField === "severity") {
      const severityOrder = { critical: 3, warning: 2, info: 1 }
      const aValue = severityOrder[a.severity as keyof typeof severityOrder] || 1
      const bValue = severityOrder[b.severity as keyof typeof severityOrder] || 1
      return sortDirection === "desc" ? bValue - aValue : aValue - bValue
    } else if (sortField === "timestamp") {
      return sortDirection === "desc" ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp)
    }
    return 0
  })

  const handleSort = (field: "severity" | "timestamp") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const markAsRead = (id: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
  }

  const handlePageChange = (page: number) => {
    fetchAlerts(page, pagination.limit)
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const { currentPage, totalPages } = pagination

    // Always show first page
    if (totalPages > 0) {
      items.push(
          <PaginationItem key={1}>
            <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(1)
                }}
                isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>,
      )
    }

    // Show ellipsis if there's a gap
    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="ellipsis-start" />)
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
            <PaginationItem key={i}>
              <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(i)
                  }}
                  isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>,
        )
      }
    }

    // Show ellipsis if there's a gap
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="ellipsis-end" />)
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(totalPages)
                }}
                isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
      )
    }

    return items
  }

  if (loading) {
    return (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>KPI</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell>
                        <div className="flex items-start space-x-2">
                          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                          <div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <div className="text-lg font-medium mb-2">Error loading alerts</div>
          <div className="text-muted-foreground mb-4">{error}</div>
          <Button onClick={() => fetchAlerts(1, 10)}>Try Again</Button>
        </div>
    )
  }
  const severityIconMap: Record<string, React.ReactNode> = {
    critical: <AlertCircle className="mr-1 h-3 w-3" />,
    warning: <AlertTriangle className="mr-1 h-3 w-3" />,
    info: <Info className="mr-1 h-3 w-3" />,
  }

  const severityVariantMap: Record<string, string> = {
    critical: "destructive",
    warning: "default",
    info: "outline",
  }

  const getSeverityIcon = (severity: string) => {
    return severityIconMap[severity] || <Info className="mr-1 h-3 w-3" />
  }

  const getSeverityVariant = (severity: string) => {
    return severityVariantMap[severity] || "outline"
  }
  return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("severity")} className="flex items-center">
                    Severity
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("timestamp")} className="flex items-center">
                    Time
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAlerts.map((alert) => (
                  <TableRow key={alert.id} className={!alert.isRead ? "bg-muted/20" : ""}>
                    <TableCell>
                      <div className="flex items-start space-x-2">
                        {!alert.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
                        <div>
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">{alert.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{alert.kpi}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                        {getSeverityIcon(alert.severity)}
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {!alert.isRead && (
                            <Button variant="outline" size="sm" onClick={() => markAsRead(alert.id)}>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Mark as Read
                            </Button>
                        )}
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
            <div className="flex flex-col items-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}{" "}
                alerts
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationFirst
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (pagination.hasPreviousPage) handlePageChange(1)
                        }}
                        className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (pagination.hasPreviousPage) handlePageChange(pagination.currentPage - 1)
                        }}
                        className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (pagination.hasNextPage) handlePageChange(pagination.currentPage + 1)
                        }}
                        className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLast
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (pagination.hasNextPage) handlePageChange(pagination.totalPages)
                        }}
                        className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
        )}

        {sortedAlerts.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <div className="text-lg font-medium mb-2">No alerts found</div>
              <div className="text-muted-foreground mb-4">There are no alerts matching your current filter</div>
            </div>
        )}
      </div>
  )
}
