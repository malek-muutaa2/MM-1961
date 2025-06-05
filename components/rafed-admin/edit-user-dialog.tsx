"use client"

import React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, UserRole, UserStatus } from "@/types/rafed-types"
import { UserType } from "@/lib/db/schema"
import { useToast } from "@/hooks/use-toast"
import { updateUser } from "@/lib/user"

interface EditUserDialogProps {
  user: UserType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<UserRole>(user.role)
  const [status, setStatus] = useState<UserStatus>(user.status)
  const [organization, setOrganization] = useState(user.organization)
  const [isSubmitting, setIsSubmitting] = useState(false)
 let [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isPending) return;

   
  }, [isPending]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call

    console.log("Updating user:", { id: user.id, name, email, role, status, organization })
     startTransition(async () => {
         try {
           
           // Add your submit logic here, including the number of potential matches
           await updateUser(
             user.id,
             name,
             role,
              organization,
            
           ).then((data) => {
             console.log("Form submitted!", data);
             if (data?.message) {
               toast({
                 title: "user",
   
                 variant: "default",
                 description: data?.message,
               });
             } else if (data?.error) {
               toast({
                 title: "user",
   
                 variant: "destructive",
                 description: data?.error,
               });
             }
           });
         } catch (error) {
           // Handle submission error, if any
           toast({
             title: "user",
   
             variant: "destructive",
             description: "error occurred while adding user",
           });
           console.error("Submission error:", error);
         }
       });
    // Close dialog
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information and permissions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                 
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              {/* <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Organization name"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving Changes...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
