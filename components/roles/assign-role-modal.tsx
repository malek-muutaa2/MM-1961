"use client"

import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { RoleType, UserType } from "@/lib/db/schema"

interface AssignRoleModalProps {
  role: RoleType
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignRoleModal({ role, isOpen, onOpenChange }: AssignRoleModalProps) {
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchUsers()
    }
  }, [isOpen, role.role_id])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // Get all users
      const usersResponse = await fetch("/api/users")
      const usersData = await usersResponse.json()

      // Get users assigned to this role
      const assignedResponse = await fetch(`/api/user-roles?role_id=${role.role_id}`)
      const assignedData = await assignedResponse.json()

      const assignedUserIds = new Set(assignedData.userRoles?.map((ur: any) => ur.user_id) || [])

      setUsers(usersData.users || [])
      setSelectedUsers(assignedUserIds)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUser = (userId: number) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/roles/assign-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: role.role_id,
          user_ids: Array.from(selectedUsers),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to assign role")
      }

      toast({
        title: "Success",
        description: "Users assigned successfully",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign role",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Role Users</DialogTitle>
          <DialogDescription>Select users to assign the "{role.name}" role</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">Loading users...</div>
        ) : (
          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={() => handleToggleUser(user.id)}
                  />
                  <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </label>
                  {user.role && <Badge variant="outline">{user.role}</Badge>}
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No users available</p>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
