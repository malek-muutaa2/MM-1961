"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { RoleType } from "@/lib/db/schema"

interface RoleFormModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  editingRole?: RoleType | null
  onRoleAdded?: (role: RoleType) => void
  onRoleUpdated?: (role: RoleType) => void
  showTrigger?: boolean
}

export function RoleFormModal({
  isOpen = false,
  onOpenChange,
  editingRole,
  onRoleAdded,
  onRoleUpdated,
  showTrigger = false,
}: RoleFormModalProps) {
  const [open, setOpen] = useState(isOpen)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (editingRole) {
      setName(editingRole.name)
      setDescription(editingRole.description || "")
      setOpen(true)
    }
  }, [editingRole])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (editingRole) {
        // Update role
        const response = await fetch(`/api/roles/${editingRole.role_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update role")
        }

        const data = await response.json()
        onRoleUpdated?.(data.role)

        toast({
          title: "Success",
          description: "Role updated successfully",
        })
      } else {
        // Create role
        const response = await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create role")
        }

        const data = await response.json()
        onRoleAdded?.(data.role)

        toast({
          title: "Success",
          description: "Role created successfully",
        })
      }

      setName("")
      setDescription("")
      setOpen(false)
      onOpenChange?.(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {editingRole ? "Update the role details" : "Add a new role to the system"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Role Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter role description"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : editingRole ? "Update Role" : "Add Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
