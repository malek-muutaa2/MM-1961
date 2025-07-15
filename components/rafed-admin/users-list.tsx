"use client"

import { useState } from "react"
import { MoreHorizontal, UserCog } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User, UserRole, UserStatus } from "@/types/rafed-types"
import { EditUserDialog } from "./edit-user-dialog"
import { UserType } from "@/lib/db/schema"

// Sample data - in a real app, this would come from an API
// const users: User[] = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     role: "admin",
//     status: "active",
//     organization: "Rafed Admin",
//     createdAt: "2023-01-15T10:30:00Z",
//     lastLogin: "2023-06-10T08:45:00Z",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane.smith@provider.com",
//     role: "provider",
//     status: "active",
//     organization: "Medical Supplies Inc.",
//     createdAt: "2023-02-20T14:15:00Z",
//     lastLogin: "2023-06-09T16:30:00Z",
//   },
//   {
//     id: "3",
//     name: "Robert Johnson",
//     email: "robert@supplier.com",
//     role: "supplier",
//     status: "active",
//     organization: "Johnson Medical Equipment",
//     createdAt: "2023-03-05T09:45:00Z",
//     lastLogin: "2023-06-08T11:20:00Z",
//   },
//   {
//     id: "4",
//     name: "Sarah Williams",
//     email: "sarah@provider.com",
//     role: "provider",
//     status: "pending",
//     organization: "City Hospital",
//     createdAt: "2023-05-12T13:10:00Z",
//   },
//   {
//     id: "5",
//     name: "Michael Brown",
//     email: "michael@admin.com",
//     role: "admin",
//     status: "active",
//     organization: "Rafed Admin",
//     createdAt: "2023-04-18T11:30:00Z",
//     lastLogin: "2023-06-07T09:15:00Z",
//   },
//   {
//     id: "6",
//     name: "Emily Davis",
//     email: "emily@supplier.com",
//     role: "supplier",
//     status: "inactive",
//     organization: "Davis Medical Supplies",
//     createdAt: "2023-02-28T10:20:00Z",
//     lastLogin: "2023-05-15T14:40:00Z",
//   },
// ]

interface UsersListProps {
  searchQuery: string
  users : UserType[]
}

export function UsersList({
  searchQuery,
  users,
}: Readonly<UsersListProps>) {
    const [editingUser, setEditingUser] = useState<User | null>(null)

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "default"
      case "User":
        return "secondary"
      
      default:
        return "default"
    }
  }

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "inactive":
        return "destructive"

    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Created</TableHead>
              {/* <TableHead>Last Login</TableHead> */}
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role) as any}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.isDisabled === true ? "inactive" : "active") as any}>
                     {user.isDisabled === true ? "Inactive" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  {/* <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell> */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={user.isDisabled === false}
                          onClick={() => console.log("Activate user", user.id)}
                        >
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={user.isDisabled === true}
                          onClick={() => console.log("Deactivate user", user.id)}
                        >
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => console.log("Delete user", user.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => {
            if (!open) setEditingUser(null)
          }}
        />
      )}
    </>
  )
}
