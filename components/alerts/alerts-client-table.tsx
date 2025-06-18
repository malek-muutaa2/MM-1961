"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { AlertsDataTable } from "./alerts-data-table"
import { createAlertsColumns } from "./alerts-columns"
import { LoadingSpinner } from "@/components/Spinner"
import { useToast } from "@/components/ui/use-toast"

interface AlertsResponse {
    alerts: any[]
    pagination: {
        currentPage: number
        totalPages: number
        totalCount: number
        limit: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

export function AlertsClientTable() {
    const [data, setData] = useState<AlertsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { toast } = useToast()

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true)
            console.log("Fetching alerts with searchParams:", searchParams.toString())

            const response = await fetch(`/api/alerts?${searchParams.toString()}`, {
                cache: "no-store",
            })

            if (!response.ok) {
                throw new Error("Failed to fetch alerts")
            }

            const result = await response.json()
            console.log("Fetched alerts:", result)
            setData(result)
        } catch (error) {
            console.error("Error fetching alerts:", error)
            toast({
                title: "Error",
                description: "Failed to fetch alerts",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }, [searchParams, toast])

    // Fetch data when searchParams change
    useEffect(() => {
        fetchAlerts()
    }, [fetchAlerts])

    // Callback for when data needs to be refreshed (after status updates, etc.)
    const handleDataChange = useCallback(() => {
        console.log("Data change requested, refetching...")
        fetchAlerts()
    }, [fetchAlerts])

    const columns = createAlertsColumns(handleDataChange)

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>No data available</p>
            </div>
        )
    }

    return (
        <AlertsDataTable
            columns={columns}
            data={data.alerts}
            pageNumber={data.pagination.currentPage}
            numberOfPages={data.pagination.totalPages}
            search={searchParams.get("search") || ""}
            size={searchParams.get("size") || "10"}
            column={searchParams.get("column") || "triggeredAt"}
            pathname={pathname}
            order={searchParams.get("order") || "desc"}
        />
    )
}
