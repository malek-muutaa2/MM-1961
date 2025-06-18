"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Info, ArrowRight, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Alert {
    id: number
    status: string
    severity: string
    triggeredAt: string
    resolvedAt: string | null
    templateName: string
    templateMessage: string
    kpiName: string
    hydratedMessage: string
    fieldValues: Record<string, string>
}

function getTimeAgo(dateString: string): string {
    const now = new Date()
    const alertTime = new Date(dateString)
    const diffInMs = now.getTime() - alertTime.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    }
}

function getSeverityIcon(severity: string) {
    switch (severity?.toLowerCase()) {
        case "critical":
            return <AlertCircle className="mr-1 h-3 w-3" />
        case "warning":
            return <AlertTriangle className="mr-1 h-3 w-3" />
        case "info":
            return <Info className="mr-1 h-3 w-3" />
        default:
            return <Info className="mr-1 h-3 w-3" />
    }
}

function getSeverityVariant(severity: string) {
    switch (severity?.toLowerCase()) {
        case "critical":
            return "destructive"
        case "warning":
            return "default"
        case "info":
            return "outline"
        default:
            return "outline"
    }
}

export function DynamicAlertsList() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch("/api/alerts")
                if (!response.ok) {
                    throw new Error("Failed to fetch alerts")
                }
                const data = await response.json()
                setAlerts(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchAlerts()
    }, [])

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-2/3" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <div className="text-lg font-medium mb-2">Error Loading Alerts</div>
                <div className="text-muted-foreground">{error}</div>
            </div>
        )
    }

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-lg font-medium mb-2">No Active Alerts</div>
                <div className="text-muted-foreground">All systems are running smoothly</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-base">{alert.templateName}</h3>
                                    <div className="flex flex-col items-end space-y-2 ml-4">
                                        <Badge variant={getSeverityVariant(alert.severity) as any} className="text-xs">
                                            {getSeverityIcon(alert.severity)}
                                            {alert.severity}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">{getTimeAgo(alert.triggeredAt)}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed">{alert.hydratedMessage}</p>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs font-medium text-primary">KPI: {alert.kpiName}</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
