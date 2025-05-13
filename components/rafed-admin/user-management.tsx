"use client"

import { useState } from "react"
import { Plus, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { UsersList } from "./users-list"
import { InvitationsList } from "./invitations-list"
import { InviteUserDialog } from "./invite-user-dialog"
import { AddUserDialog } from "./add-user-dialog"

export function UserManagement() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setInviteDialogOpen(true)} variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
            <Button onClick={() => setAddUserDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        <TabsContent value="users" className="mt-6">
          <UsersList searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="invitations" className="mt-6">
          <InvitationsList searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>

      <InviteUserDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
      <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen} />
    </div>
  )
}
