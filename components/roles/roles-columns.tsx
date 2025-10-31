"use client"

import type { RoleType } from "@/lib/db/schema"
import { CaretSortIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RoleActions } from "./role-actions"

export const RolesColumns: ColumnDef<RoleType>[] = [
  {
    accessorKey: "role_id",
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
    cell: ({ row }) => <div className="font-medium">{row.getValue("role_id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div className="flex items-center">
        <button className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
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
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.getValue("name")}</span>
        {row.original.is_builtin && <Badge variant="secondary">Built-in</Badge>}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-md truncate text-muted-foreground">{row.getValue("description") || "No description"}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RoleActions role={row.original} />,
  },
]
