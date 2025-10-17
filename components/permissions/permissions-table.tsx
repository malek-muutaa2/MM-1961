"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/permissions/permissions-datatable"
import { PermissionsColumns } from "@/components/permissions/permissions-columns"
import type { PermissionType } from "@/lib/db/schema"

interface PermissionsTableProps {
    pageNumber: number
    size: number
    search: string
    column: string
    order: string
}

export function PermissionsTable({ pageNumber, size, search, column, order }: PermissionsTableProps) {
    const [permissions, setPermissions] = useState<PermissionType[]>([])
    const [numberOfPages, setNumberOfPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPermissions = async () => {
            setIsLoading(true)
            try {
                const params = new URLSearchParams({
                    page: pageNumber.toString(),
                    size: size.toString(),
                    ...(search && { search }),
                    column,
                    order,
                })

                const response = await fetch(`/api/permissions?${params}`)
                const data = await response.json()

                if (response.ok) {
                    setPermissions(data.permissions)
                    setNumberOfPages(data.numberOfPages)
                }
            } catch (error) {
                console.error("Error fetching permissions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPermissions()
    }, [pageNumber, size, search, column, order])

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading permissions...</div>
    }

    return (
        <DataTable
            columns={PermissionsColumns}
            data={permissions}
            pageNumber={pageNumber}
            numberOfPages={numberOfPages}
            search={search}
            size={size.toString()}
            column={column}
            order={order}
            pathname="/admin/permissions"
        />
    )
}
