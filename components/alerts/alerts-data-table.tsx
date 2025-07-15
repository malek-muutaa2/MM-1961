"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationFirst,
    PaginationLast,
} from "@/components/ui/pagination2"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { LoadingSpinner } from "@/components/Spinner"
import { Filter, AlertTriangle, Info, XCircle } from 'lucide-react'
import type { Alert } from "./alerts-columns"

interface AlertsDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: Alert[]
    pageNumber: number
    numberOfPages: number
    search: string
    size: string
    column: string
    pathname: string
    order: string
}

export function AlertsDataTable<TData, TValue>({
                                                   columns,
                                                   data,
                                                   pageNumber,
                                                   size,
                                                   search,
                                                   numberOfPages,
                                                   pathname,
                                                   order,
                                                   column,
                                               }: Readonly<AlertsDataTableProps<TData, TValue>>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [severityFilter, setSeverityFilter] = useState<string[]>([])
    const [isPending, startTransition] = React.useTransition()

    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize sorting state from URL
    useEffect(() => {
        if (column && order) {
            setSorting([{ id: column, desc: order === "desc" }])
        }
    }, [column, order])

    // Initialize severity filter from URL
    useEffect(() => {
        const severityParam = searchParams.get("severity")
        if (severityParam) {
            const severities = severityParam.split(",").filter(Boolean)
            setSeverityFilter(severities)
        } else {
            setSeverityFilter([])
        }
    }, [searchParams])

    const table = useReactTable({
        data,
        columns: columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualSorting: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Handle sorting changes
    useEffect(() => {
        if (sorting.length > 0) {
            const sortColumn = sorting[0].id
            const sortOrder = sorting[0].desc ? "desc" : "asc"

            // Only update if the sorting actually changed
            if (sortColumn !== column || sortOrder !== order) {
                console.log("Sorting changed:", { column: sortColumn, order: sortOrder })

                startTransition(() => {
                    const url = buildUrl({
                        search: search || undefined,
                        page: "1", // Reset to first page when sorting
                        column: sortColumn,
                        order: sortOrder,
                        severity: severityFilter.length > 0 ? severityFilter.join(",") : undefined,
                    })
                    router.push(url, { scroll: false })
                })
            }
        }
    }, [sorting])

    const buildUrl = (params: Record<string, string | undefined>) => {
        const url = new URL(pathname, window.location.origin)

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && value !== "null") {
                url.searchParams.set(key, value)
            }
        })

        console.log("Built URL:", url.pathname + url.search)
        return url.pathname + url.search
    }

    // Helper function to build pagination URLs
    const buildPaginationUrl = (page: number) => {
        return buildUrl({
            search: search || undefined,
            page: page.toString(),
            size,
            column,
            order,
            severity: severityFilter.length > 0 ? severityFilter.join(",") : undefined,
        })
    }

    const handleSearch = useDebouncedCallback((term: string) => {
        console.log("Search term:", term)
        startTransition(() => {
            const url = buildUrl({
                search: term.trim() || undefined,
                page: "1",
                size,
                column,
                order,
                severity: severityFilter.length > 0 ? severityFilter.join(",") : undefined,
            })
            router.push(url, { scroll: false })
        })
    }, 750)

    const handleSeverityFilter = (severity: string, checked: boolean) => {
        console.log(`Severity filter: ${severity} = ${checked}`)

        let newFilter = [...severityFilter]
        if (checked) {
            if (!newFilter.includes(severity)) {
                newFilter.push(severity)
            }
        } else {
            newFilter = newFilter.filter((s) => s !== severity)
        }

        console.log("New severity filter:", newFilter)
        setSeverityFilter(newFilter)

        startTransition(() => {
            const url = buildUrl({
                search: search || undefined,
                page: "1",
                size,
                column,
                order,
                severity: newFilter.length > 0 ? newFilter.join(",") : undefined,
            })
            router.push(url, { scroll: false })
        })
    }

    const clearSeverityFilter = () => {
        console.log("Clearing severity filters")
        setSeverityFilter([])
        startTransition(() => {
            const url = buildUrl({
                search: search || undefined,
                page: "1",
                size,
                column,
                order,
            })
            router.push(url, { scroll: false })
        })
    }

    const severityOptions = [
        { value: "critical", label: "Critical", icon: XCircle, color: "text-red-600" },
        { value: "warning", label: "Warning", icon: AlertTriangle, color: "text-yellow-600" },
        { value: "info", label: "Info", icon: Info, color: "text-blue-600" },
    ]

    return (
        <div className="w-full min-h-screen overflow-x-hidden justify-center items-center">
            <div className="mx-auto">
                <div className="flex justify-between py-3 px-4">
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Search alerts..."
                            onChange={(e) => handleSearch(e.target.value)}
                            defaultValue={search === "null" || search === null || !search ? "" : search}
                            className="max-w-sm"
                        />
                        {isPending && <LoadingSpinner />}
                    </div>

                    {/* Severity Filter Button */}
                    <div className="flex space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Severity
                                    {severityFilter.length > 0 && (
                                        <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                      {severityFilter.length}
                    </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {severityOptions.map((option) => {
                                    const Icon = option.icon
                                    const isChecked = severityFilter.includes(option.value)

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={option.value}
                                            checked={isChecked}
                                            onCheckedChange={(checked) => handleSeverityFilter(option.value, checked)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-4 w-4 ${option.color}`} />
                                                {option.label}
                                            </div>
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                                {severityFilter.length > 0 && (
                                    <DropdownMenuItem onClick={clearSeverityFilter} className="text-muted-foreground">
                                        Clear filters
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="mt-4">
                    <Table>
                        <TableHeader className="sticky top-0 h-10 w-full rounded-t-md border-b-2 border-border bg-background">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className={"pl-4"} key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, {
                                                        ...header.getContext(),
                                                    })}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="!py-[10px]">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className={"pl-4 py-3"} key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No alerts found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination using pagination2 component */}
            <div className="flex items-center justify-center px-2 py-2 bg-accent">
                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    className="gap-1 text-primary cursor-pointer rounded-none px-0.5 py-1"
                                    variant="ghost"
                                    disabled={pageNumber === 1}
                                >
                                    <PaginationFirst
                                        className={"gap-1 text-primary border border-primary rounded-none px-2 py-1"}
                                        aria-disabled={pageNumber === 1}
                                        href={buildPaginationUrl(1)}
                                    />
                                </Button>
                            </PaginationItem>

                            <PaginationItem>
                                <Button
                                    variant={"ghost"}
                                    disabled={pageNumber === 1}
                                    className="text-primary rounded-none cursor-pointer px-0.5 py-1"
                                >
                                    <PaginationPrevious
                                        className={"gap-1 text-primary border border-primary rounded-none px-2 py-1"}
                                        aria-disabled={pageNumber === 1}
                                        href={buildPaginationUrl(Math.max(1, pageNumber - 1))}
                                    />
                                </Button>
                            </PaginationItem>

                            <div className="flex w-auto items-center justify-center px-4 text-sm font-medium">
                                Page {pageNumber} of {numberOfPages}
                            </div>

                            <PaginationItem>
                                <Button
                                    variant={"ghost"}
                                    disabled={numberOfPages === pageNumber}
                                    className="gap-1 text-primary rounded-none cursor-pointer px-0.5 py-1"
                                >
                                    <PaginationNext
                                        className="gap-1 text-primary border border-primary rounded-none cursor-pointer px-2 py-1"
                                        href={buildPaginationUrl(Math.min(numberOfPages, pageNumber + 1))}
                                    />
                                </Button>
                            </PaginationItem>

                            <PaginationItem>
                                <Button
                                    className="gap-1 text-primary rounded-none px-0.5 py-1"
                                    variant="ghost"
                                    disabled={pageNumber === numberOfPages}
                                >
                                    <PaginationLast
                                        className={"gap-1 text-primary border border-primary rounded-none px-2 py-1 cursor-pointer"}
                                        aria-disabled={pageNumber === numberOfPages}
                                        href={buildPaginationUrl(numberOfPages)}
                                    />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}
