"use client"

import type { PermissionType } from "@/lib/db/schema"
import { CaretSortIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const PermissionsColumns: ColumnDef<PermissionType>[] = [
    {
        accessorKey: "permission_id",
        header: ({ column }) => (
            <div className="flex font-medium items-center">
                <button className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    ID
                </button>
                {(() => {
                    const sorted = column.getIsSorted()
                    if (sorted === "desc") {
                        return <ArrowDownIcon onClick={() => column.clearSorting()} className="ml-2 h-4 w-4 cursor-pointer" />
                    } else if (sorted === "asc") {
                        return (
                            <ArrowUpIcon
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                className="ml-2 h-4 w-4 cursor-pointer"
                            />
                        )
                    } else {
                        return (
                            <CaretSortIcon
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                className="ml-2 h-4 w-4 cursor-pointer"
                            />
                        )
                    }
                })()}
            </div>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("permission_id")}</div>,
    },
    {
        accessorKey: "domain",
        header: ({ column }) => (
            <div className="flex items-center">
                <button className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Domain
                </button>
                {(() => {
                    const sorted = column.getIsSorted()
                    if (sorted === "desc") {
                        return <ArrowDownIcon onClick={() => column.clearSorting()} className="ml-2 h-4 w-4 cursor-pointer" />
                    } else if (sorted === "asc") {
                        return (
                            <ArrowUpIcon
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                className="ml-2 h-4 w-4 cursor-pointer"
                            />
                        )
                    } else {
                        return (
                            <CaretSortIcon
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                className="ml-2 h-4 w-4 cursor-pointer"
                            />
                        )
                    }
                })()}
            </div>
        ),
        cell: ({ row }) => (
            <div>
                <Badge variant="outline">{row.getValue("domain")}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "action",
        header: ({ column }) => (
            <div className="flex items-center">
                <button className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Action
                </button>
                {(() => {
                    const sorted = column.getIsSorted()
                    if (sorted === "desc") {
                        return <ArrowDownIcon onClick={() => column.clearSorting()} className="ml-2 h-4 w-4 cursor-pointer" />
                    } else if (sorted === "asc") {
                        return (
                            <ArrowUpIcon
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                className="ml-2 h-4 w-4 cursor-pointer"
                            />
                        )
                    } else {
                        return (
                            <CaretSortIcon
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                                className="ml-2 h-4 w-4 cursor-pointer"
                            />
                        )
                    }
                })()}
            </div>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("action")}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="max-w-md truncate text-muted-foreground">{row.getValue("description") || "No description"}</div>
        ),
    },
]
