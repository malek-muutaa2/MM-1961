"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlertCircle,
    AlertTriangle,
    Info,
    XCircle,
    ArrowUpDown,
} from "lucide-react"
import { AlertActionsCell } from "@/components/alerts/alert-actions-cell"

export interface Alert {
    id: number
    title: string
    description: string
    kpi: string
    severity: "critical" | "warning" | "info"
    status: string
    timestamp: string
    isRead: boolean
}

interface AlertsColumnsProps {
    onDataChange?: () => void
}

const getSeverityIcon = (severity: string) => {
    switch (severity) {
        case "critical":
            return <XCircle className="mr-1 h-3 w-3" />
        case "warning":
            return <AlertTriangle className="mr-1 h-3 w-3" />
        case "info":
            return <Info className="mr-1 h-3 w-3" />
        default:
            return <AlertCircle className="mr-1 h-3 w-3" />
    }
}

const getSeverityVariant = (severity: string) => {
    switch (severity) {
        case "critical":
            return "destructive"
        case "warning":
            return "default"
        case "info":
            return "outline"
        default:
            return "secondary"
    }
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case "active":
            return "destructive"
        case "acknowledged":
            return "secondary"
        case "resolved":
            return "default"
        case "snoozed":
        case "dismissed":
            return "outline"
        default:
            return "secondary"
    }
}

export const createAlertsColumns = (
    onDataChange?: () => void
): ColumnDef<Alert>[] => [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
            >
                Alert
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const alert = row.original
            return (
                <div className="flex items-start space-x-2">
                    {!alert.isRead && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">
                            {alert.description}
                        </div>
                    </div>
                </div>
            )
        },
        enableSorting: true,
    },
    {
        accessorKey: "kpi",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
            >
                KPI
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
        sortingFn: "text",
    },
    {
        accessorKey: "severity",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
            >
                Severity
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
        sortingFn: "text",
        cell: ({ row }) => {
            const severity: any = row.getValue("severity")
            return (
                <Badge variant={getSeverityVariant(severity)} className="capitalize">
                    {getSeverityIcon(severity)}
                    {severity}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
        sortingFn: "text",
        cell: ({ row }) => {
            const status: any = row.getValue("status")
            return (
                <Badge variant={getStatusVariant(status)} className="capitalize">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "timestamp",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
            >
                Time
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        enableSorting: true,
        sortingFn: "text",
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            const alert = row.original
            return <AlertActionsCell alert={alert} onDataChange={onDataChange} />
        },
    },
]

export const alertsColumns = createAlertsColumns()
