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
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { useCreateQueryString } from "@/lib/queryString"
import { LoadingSpinner } from "@/components/Spinner"
import { RoleFormModal } from "./role-form-modal"
import type { RoleType } from "@/lib/db/schema"

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
  onRoleAdded?: (role: RoleType) => void
  onRoleUpdated?: (role: RoleType) => void
  onRoleDeleted?: (roleId: number) => void
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
  onRoleAdded,
  onRoleUpdated,
  onRoleDeleted,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isModalOpen, setIsModalOpen] = React.useState(false)

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
    const column = String(params.get("column") ?? "role_id")
    const order = String(params.get("order") ?? "desc")
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          search: `${term}`,
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
        <div className="flex justify-between items-center py-3 px-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search roles..."
              onChange={(e) => {
                handleSearch(e.target.value)
              }}
              defaultValue={searchParams.get("search")?.toString()}
              className="max-w-sm"
            />
            {isPending && <LoadingSpinner />}
          </div>
          <RoleFormModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            onRoleAdded={onRoleAdded}
            showTrigger={true}
          />
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No roles found
                  </TableCell>
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
                        ...(size ? { size } : {}),
                        page: pageNumber - 1,
                      },
                    }}
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
