"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/roles/roles-datatable"
import { RolesColumns } from "@/components/roles/roles-columns"
import type { RoleType } from "@/lib/db/schema"

interface RolesTableProps {
  pageNumber: number
  size: number
  search: string
  column: string
  order: string
}

export function RolesTable({ pageNumber, size, search, column, order }: RolesTableProps) {
  const [roles, setRoles] = useState<RoleType[]>([])
  const [numberOfPages, setNumberOfPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        size: size.toString(),
        ...(search && { search }),
        column,
        order,
      })

      const response = await fetch(`/api/roles?${params}`)
      const data = await response.json()

      if (response.ok) {
        setRoles(data.roles)
        setNumberOfPages(data.numberOfPages)
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [pageNumber, size, search, column, order])

  const handleRoleAdded = (newRole: RoleType) => {
    setRoles((prev) => [newRole, ...prev])
  }

  const handleRoleUpdated = (updatedRole: RoleType) => {
    setRoles((prev) => prev.map((role) => (role.role_id === updatedRole.role_id ? updatedRole : role)))
  }

  const handleRoleDeleted = (roleId: number) => {
    setRoles((prev) => prev.filter((role) => role.role_id !== roleId))
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading roles...</div>
  }

  return (
    <DataTable
      columns={RolesColumns}
      data={roles}
      pageNumber={pageNumber}
      numberOfPages={numberOfPages}
      search={search}
      size={size.toString()}
      column={column}
      order={order}
      pathname="/admin/roles"
      onRoleAdded={handleRoleAdded}
      onRoleUpdated={handleRoleUpdated}
      onRoleDeleted={handleRoleDeleted}
    />
  )
}
