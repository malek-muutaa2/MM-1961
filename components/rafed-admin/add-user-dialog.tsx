"use client"

import React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

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
import type { UserRole } from "@/types/rafed-types"
import { AddUserAction, UserAdd } from "@/lib/user"
import { useToast } from "@/hooks/use-toast"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("User")
  const [organization, setOrganization] = useState("")
  const [password, setPassword] = useState("")
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

    console.log("Adding userss:", { name, email, role, organization, password })
    const crypto = window.crypto || (window as any).msCrypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    const addUserData: UserAdd = {
      username: name,
      password: array[0].toString(),
      email: email,
      role: role,
    };

    startTransition(async () => {
      try {
        console.log("Submitting user data:", addUserData);
        
        // Add your submit logic here, including the number of potential matches
        await AddUserAction(
          addUserData,
         
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
    // Reset form and close dialog
    setName("")
    setEmail("")
    setRole("User")
    setOrganization("")
    setPassword("")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Create a new user account directly. The user will receive their login credentials via email.
          </DialogDescription>
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
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrator</SelectItem>
                  <SelectItem value="User">User</SelectItem>
               
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Organization name"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
              />
            </div>
           
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Creating User...</>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
