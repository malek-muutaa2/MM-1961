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
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useCreateQueryString } from "@/lib/queryString"
import { LoadingSpinner } from "@/components/Spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Columnslogs {
  Date: string
  Acteur: string
  Evenement: string
  Description: string
  Cibles: string
}

interface LogsTable {
  Search: string
  heading: string
  NoResults: string
  title: string
  Page: string
  Export: string
  Of: string
  Columnslogs: Columnslogs
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: any[]
  pageNumber: number
  numberOfPages: number
  search: string | null
  size: string
  column: string
  pathname: string
  order: string
}

export function DataTable<TData, TValue>({
                                           columns,
                                           data,
                                           pageNumber,
                                           size,
                                           search,
                                           numberOfPages,
                                           pathname,
                                           order,
                                           column,
                                         }: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [rolesList, setRolesList] = useState<Array<{ role_id: number; name: string }>>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/roles")
        if (response.ok) {
          const data = await response.json()
          setRolesList(data.roles || [])
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        setRolesLoading(false)
      }
    }

    fetchRoles()
  }, [])

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
  const [isPending, startTransition] = React.useTransition()
  const { createQueryString } = useCreateQueryString()
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { replace } = useRouter()
  const handleSearch = useDebouncedCallback((term) => {
    const pageNumber = 1
    const column = String(params.get("column") ?? "id")
    const order = String(params.get("order") ?? "undefined")
    startTransition(() => {
      router.push(
          `${pathname}?${createQueryString({
            search: `${term}`,
            // size: `${size}`,
            page: `${pageNumber}`,
            column: `${column}`,
            order: `${order}`,
          })}`,
          {
            scroll: false,
          },
      )
    })
  }, 750)

  useEffect(() => {
    if (sorting?.[0]?.id) {
      params.set("column", sorting?.[0]?.id)
      params.set("order", sorting?.[0]?.desc ? "asc" : "desc")
    } else {
      params.delete("column")
      params.delete("order")
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, [sorting, searchParams])

  const handleNavigation = () => {
    startTransition(() => {
      // Construct the new query for the router
      const nextPage = numberOfPages === pageNumber ? pageNumber : pageNumber + 1
      router.push(
          `${pathname}?${createQueryString({
            page: `${nextPage}`,
          })}`,
          {
            scroll: false,
          },
      )
    })
  }

  return (
      <div className="w-full min-h-screen overflow-x-hidden justify-center items-center">
        <div className="mx-auto">
          {/* <DashboardHeader heading="Logs"></DashboardHeader> */}
          <div className="flex justify-between py-3 px-4">
            <div className="flex space-x-2">
              <Input
                  placeholder="Search"
                  onChange={(e) => {
                    handleSearch(e.target.value)
                  }}
                  defaultValue={searchParams.get("search")?.toString()}
                  className="max-w-sm"
              />
              <Select
                  value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) => {
                    table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
                  }}
                  disabled={rolesLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Filter by role"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {rolesList.map((role) => (
                      <SelectItem key={role.role_id} value={role.name}>
                        {role.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isPending && <LoadingSpinner />}
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
                                  : flexRender(header.column.columnDef.header, { ...header.getContext() })}
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
                      {/* <TableCell colSpan={columns.length} className="h-24 text-center">
                    no results
                  </TableCell> */}
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

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
                        className="gap-1 text-primary border border-primary rounded-none px-2 py-1"
                        aria-disabled={pageNumber === 1}
                        href={{
                          pathname: pathname,
                          query: {
                            ...(search ? { search } : {}),
                            ...(size ? { size } : {}),
                          },
                        }}
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
                        className="gap-1 text-primary border border-primary rounded-none px-2 py-1"
                        aria-disabled={pageNumber === 1}
                        href={{
                          pathname: pathname,
                          query: {
                            ...(search ? { search } : {}),
                            page: pageNumber - 1,
                            ...(size ? { size } : {}),
                          },
                        }}
                    />
                  </Button>
                </PaginationItem>

                <div className="flex w-auto items-center justify-center px-4 text-sm font-medium">
                  {"Page"} {pageNumber} {"de"} {numberOfPages}
                </div>

                <PaginationItem>
                  <Button
                      variant={"ghost"}
                      disabled={numberOfPages === pageNumber}
                      onClick={handleNavigation}
                      className="gap-1 text-primary rounded-none cursor-pointer px-0.5 py-1"
                  >
                    <PaginationNext
                        className="gap-1 text-primary border border-primary rounded-none cursor-pointer px-2 py-1"
                        href={{
                          pathname: pathname,
                          query: {
                            ...(search ? { search } : {}),
                            page: numberOfPages === pageNumber ? pageNumber : pageNumber + 1,
                            ...(size ? { size } : {}),
                          },
                        }}
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
                        className="gap-1 text-primary border border-primary rounded-none px-2 py-1 cursor-pointer"
                        aria-disabled={pageNumber === 1}
                        href={{
                          pathname: pathname,
                          query: {
                            ...(search ? { search } : {}),
                            ...(size ? { size } : {}),
                            page: numberOfPages,
                          },
                        }}
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
