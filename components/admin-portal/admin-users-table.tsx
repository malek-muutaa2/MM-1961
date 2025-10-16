"use client"

import { useState } from "react"
import { MoreHorizontal, UserCog, Search } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import type { UserType } from "@/lib/db/schema"
import type { UserRole, UserStatus } from "@/types/rafed-types"
import { EditUserDialog } from "@/components/rafed-admin/edit-user-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUser } from "@/lib/user"
import { useToast } from "@/hooks/use-toast"

interface AdminUsersTableProps {
    users: UserType[]
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export function AdminUsersTable({ users, searchQuery, setSearchQuery }: AdminUsersTableProps) {
    const [editingUser, setEditingUser] = useState<UserType | null>(null)
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const { toast } = useToast()

    // Filter users based on search query and role filter
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.organization && user.organization.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesRole = roleFilter === "all" || user.role === roleFilter

        return matchesSearch && matchesRole
    })

    const getRoleBadgeVariant = (role: UserRole) => {
        switch (role) {
            case "Admin":
                return "destructive"
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

    const handleRoleChange = async (userId: number, newRole: UserRole, userName: string, organization: string | null) => {
        try {
            const result = await updateUser(userId, userName, newRole, organization)

            if (result?.message) {
                toast({
                    title: "Success",
                    description: result.message,
                    variant: "default",
                })
                // Refresh the page to show updated data
                window.location.reload()
            } else if (result?.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user role",
                variant: "destructive",
            })
        }
    }

    return (
        <>
            <div className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or organization..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Users Table */}
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
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={user.role}
                                                onValueChange={(newRole) =>
                                                    handleRoleChange(user.id, newRole as UserRole, user.name, user.organization)
                                                }
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue>
                                                        <Badge variant={getRoleBadgeVariant(user.role) as any}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </Badge>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="User">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(user.isDisabled === true ? "inactive" : "active") as any}>
                                                {user.isDisabled === true ? "Inactive" : "Active"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.organization || "-"}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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

                <div className="text-sm text-muted-foreground">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
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
