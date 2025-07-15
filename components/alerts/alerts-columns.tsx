"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlertCircle,
    AlertTriangle,
    Info,
    MoreHorizontal,
    MessageSquare,
    RefreshCw,
    XCircle,
    ArrowUpDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { AlertStatusUpdateDialog } from "./alert-status-update-dialog"
import { AlertCommentDialog } from "./alert-comment-dialog"
import { AlertCommentsPopover } from "./alert-comments-popover"

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


// Add a callback prop to handle data refresh
interface AlertsColumnsProps {
    onDataChange?: () => void
}

export const createAlertsColumns = (onDataChange?: () => void): ColumnDef<Alert>[] => [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    Alert
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const alert = row.original
            return (
                <div className="flex items-start space-x-2">
                    {!alert.isRead && <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
                    <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                    </div>
                </div>
            )
        },
        enableSorting: true,
    },
    {
        accessorKey: "kpi",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    KPI
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableSorting: true,
        sortingFn: "text",
    },
    {
        accessorKey: "severity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    Severity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableSorting: true,
        sortingFn: "text",
        cell: ({ row }) => {
            const severity = row.getValue("severity") as string

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
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableSorting: true,
        sortingFn: "text",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const getStatusVariant = (status: string) => {
                switch (status) {
                    case "active":
                        return "destructive"
                    case "acknowledged":
                        return "secondary"
                    case "resolved":
                        return "default"
                    case "snoozed":
                        return "outline"
                    case "dismissed":
                        return "outline"
                    default:
                        return "secondary"
                }
            }

            return (
                <Badge variant={getStatusVariant(status)} className="capitalize">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "timestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                    Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableSorting: true,
        sortingFn: "text",
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            const alert = row.original
            const [statusDialogOpen, setStatusDialogOpen] = useState(false)
            const [commentDialogOpen, setCommentDialogOpen] = useState(false)

            const handleSuccess = () => {
                // Call the parent callback to refresh data
                if (onDataChange) {
                    onDataChange()
                }
            }

            return (
                <>
                    <div className="flex justify-end items-center space-x-1">
                        {/* Comments Popover */}
                        <AlertCommentsPopover alert={alert} />

                        {/* More Actions Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setCommentDialogOpen(true)}>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Add Comment
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Update Alert Status
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <AlertStatusUpdateDialog
                        alert={alert}
                        open={statusDialogOpen}
                        onOpenChange={setStatusDialogOpen}
                        onSuccess={handleSuccess}
                    />

                    <AlertCommentDialog
                        alert={alert}
                        open={commentDialogOpen}
                        onOpenChange={setCommentDialogOpen}
                        onSuccess={handleSuccess}
                    />
                </>
            )
        },
    },
]

// Export default columns for backward compatibility
export const alertsColumns = createAlertsColumns()
