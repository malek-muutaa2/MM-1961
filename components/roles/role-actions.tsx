"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Edit2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RoleFormModal } from "./role-form-modal"
import { AssignRoleModal } from "./assign-role-modal"
import { useToast } from "@/hooks/use-toast"
import type { RoleType } from "@/lib/db/schema"

interface RoleActionsProps {
  role: RoleType
  onRoleUpdated?: (role: RoleType) => void
  onRoleDeleted?: (roleId: number) => void
}

export function RoleActions({ role, onRoleUpdated, onRoleDeleted }: RoleActionsProps) {
  const [editingRole, setEditingRole] = useState<RoleType | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCheckingAssignment, setIsCheckingAssignment] = useState(false)
  const [canDelete, setCanDelete] = useState(true)
  const { toast } = useToast()

  const handleDeleteClick = async () => {
    setIsCheckingAssignment(true)
    try {
      // Check if role is assigned to any users
      const response = await fetch(`/api/user-roles?role_id=${role.role_id}`)
      const data = await response.json()

      if (data.userRoles && data.userRoles.length > 0) {
        setCanDelete(false)
        toast({
          title: "Cannot Delete",
          description: `This role is assigned to ${data.userRoles.length} user(s). Remove all assignments first.`,
          variant: "destructive",
        })
        return
      }

      setCanDelete(true)
      setIsDeleteDialogOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check role assignments",
        variant: "destructive",
      })
    } finally {
      setIsCheckingAssignment(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/roles/${role.role_id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete role")
      }

      onRoleDeleted?.(role.role_id)
      toast({
        title: "Success",
        description: "Role deleted successfully",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete role",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditingRole(role)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAssignOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDeleteClick}
            disabled={isCheckingAssignment}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Role
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RoleFormModal
        editingRole={editingRole}
        onRoleUpdated={(updatedRole) => {
          onRoleUpdated?.(updatedRole)
          setEditingRole(null)
        }}
        showTrigger={false}
      />

      <AssignRoleModal role={role} isOpen={isAssignOpen} onOpenChange={setIsAssignOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{role.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
