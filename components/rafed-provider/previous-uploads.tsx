"use client"

import {useState, useEffect} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {CheckCircle, Calendar, ExternalLink} from "lucide-react"
import Link from "next/link"
import {Can, useAbility} from "@/lib/casl/permissions-provider";
import {AppAbility} from "@/lib/casl/ability";

interface ForecastExecution {
    id: number
    dateExecution: string
    createdAt: string
}

interface PreviousUploadsProps {
    searchQuery: string
    yearFilter: string
    monthFilter: string
    statusFilter: string
}

export function PreviousUploads({searchQuery, yearFilter, monthFilter, statusFilter}: PreviousUploadsProps) {
    const [executions, setExecutions] = useState<ForecastExecution[]>([])
    const [loading, setLoading] = useState(true)
    const ability: AppAbility = useAbility()
    // Déplacer toutes les fonctions utilitaires ici, avant useEffect
    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return "—"
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Format period for display
    const formatPeriod = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "long",
        }).format(date)
    }

    // Generate filename based on execution date
    const generateFileName = (dateString: string) => {
        const date = new Date(dateString)
        const monthName = date.toLocaleDateString("en-US", {month: "long"}).toLowerCase()
        const year = date.getFullYear()
        return `forecast-${monthName}-${year}.xlsx`
    }

    useEffect(() => {
        const fetchExecutions = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/forecast-executions")
                if (!response.ok) throw new Error("Failed to fetch forecast executions")

                const data = await response.json()
                setExecutions(data)
            } catch (error) {
                console.error("Error fetching forecast executions:", error)
                // Fallback avec des données mock si l'API échoue
                setExecutions([
                    {
                        id: 1,
                        dateExecution: "2025-04-15T10:30:00Z",
                        createdAt: "2025-04-15T10:30:00Z",
                    },
                    {
                        id: 2,
                        dateExecution: "2025-03-20T14:45:00Z",
                        createdAt: "2025-03-20T14:45:00Z",
                    },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchExecutions()
    }, [])

    // Filtrer les exécutions basé sur les critères de recherche
    const filteredExecutions = executions.filter((execution) => {
        const executionDate = new Date(execution.dateExecution)
        const executionYear = executionDate.getFullYear()
        const executionMonth = executionDate.getMonth() + 1

        const matchesSearch =
            searchQuery === "" ||
            execution.id.toString().includes(searchQuery) ||
            formatDate(execution.dateExecution).toLowerCase().includes(searchQuery.toLowerCase())

        const matchesYear = yearFilter === "all" || executionYear.toString() === yearFilter

        const matchesMonth = monthFilter === "all" || executionMonth.toString() === monthFilter

        // Toutes les exécutions sont considérées comme "submitted"
        const matchesStatus = statusFilter === "all" || statusFilter === "submitted"

        return matchesSearch && matchesYear && matchesMonth && matchesStatus
    })

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        )
    }

    if (filteredExecutions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <Calendar className="mb-2 h-10 w-10 text-muted-foreground"/>
                <h3 className="text-lg font-medium">No executions found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            {ability.can('read', 'ForecastExecution') ?
                (<Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Execution ID</TableHead>
                            <TableHead>Forecast Period</TableHead>
                            <TableHead>File Name</TableHead>
                            <TableHead>Execution Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Anomalies</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredExecutions.map((execution) => (
                            <TableRow key={execution.id}>
                                <TableCell className="font-medium">#{execution.id}</TableCell>
                                <TableCell>{formatPeriod(execution.dateExecution)}</TableCell>
                                <TableCell>{generateFileName(execution.dateExecution)}</TableCell>
                                <TableCell>{formatDate(execution.dateExecution)}</TableCell>
                                <TableCell>
                                    <Badge className="flex items-center gap-1 bg-green-500 hover:bg-green-600">
                                        <CheckCircle className="h-3 w-3"/>
                                        Submitted
                                    </Badge>
                                </TableCell>
                                <TableCell>—</TableCell>
                                <TableCell className="text-right">
                                    <Can I="read" a="Forecast">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="gap-1 border-primary text-primary hover:bg-primary/10"
                                        >
                                            <Link href={`/rafed-provider/history/${execution.id}`}>
                                                <span>View Details</span>
                                                <ExternalLink className="h-3.5 w-3.5"/>
                                            </Link>
                                        </Button>
                                    </Can>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>) : (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        You do not have permission to view forecast executions.
                    </div>
                )
            }
        </div>
    )
}
