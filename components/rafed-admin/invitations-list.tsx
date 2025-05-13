"use client"

import { MoreHorizontal, RefreshCw, Send } from "lucide-react"

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
import type { Invitation, UserRole } from "@/types/rafed-types"

// Sample data - in a real app, this would come from an API
const invitations: Invitation[] = [
  {
    id: "1",
    email: "david.miller@hospital.com",
    role: "provider",
    organization: "Central Hospital",
    status: "pending",
    createdAt: "2023-06-01T10:30:00Z",
    expiresAt: "2023-06-15T10:30:00Z",
    createdBy: "John Doe",
  },
  {
    id: "2",
    email: "lisa.wong@supplier.com",
    role: "supplier",
    organization: "Wong Medical Supplies",
    status: "pending",
    createdAt: "2023-06-02T14:15:00Z",
    expiresAt: "2023-06-16T14:15:00Z",
    createdBy: "John Doe",
  },
  {
    id: "3",
    email: "mark.taylor@admin.com",
    role: "admin",
    organization: "Rafed Admin",
    status: "accepted",
    createdAt: "2023-05-25T09:45:00Z",
    expiresAt: "2023-06-08T09:45:00Z",
    createdBy: "Michael Brown",
  },
  {
    id: "4",
    email: "jennifer.adams@hospital.com",
    role: "provider",
    organization: "Adams Medical Center",
    status: "expired",
    createdAt: "2023-05-15T13:10:00Z",
    expiresAt: "2023-05-29T13:10:00Z",
    createdBy: "Michael Brown",
  },
]

interface InvitationsListProps {
  searchQuery: string
}

export function InvitationsList({ searchQuery }: InvitationsListProps) {
  // Filter invitations based on search query
  const filteredInvitations = invitations.filter(
    (invitation) =>
      invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.organization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "default"
      case "provider":
        return "secondary"
      case "supplier":
        return "outline"
      case "viewer":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "accepted":
        return "success"
      case "expired":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvitations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No invitations found.
              </TableCell>
            </TableRow>
          ) : (
            filteredInvitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="font-medium">{invitation.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(invitation.role) as any}>
                    {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{invitation.organization}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(invitation.status) as any}>
                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invitation.expiresAt).toLocaleDateString()}</TableCell>
                <TableCell>{invitation.createdBy}</TableCell>
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
                      <DropdownMenuItem
                        disabled={invitation.status !== "pending"}
                        onClick={() => console.log("Resend invitation", invitation.id)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Resend
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={invitation.status !== "expired"}
                        onClick={() => console.log("Renew invitation", invitation.id)}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Renew
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => console.log("Cancel invitation", invitation.id)}
                      >
                        Cancel
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
  )
}
