"use client"

import React, { useState } from "react"
import { MoreHorizontal, Plus, Search, UserCog, UserPlus } from "lucide-react"
import {
  ColumnDef,

} from "@tanstack/react-table";
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { UsersList } from "./users-list"
import { InvitationsList } from "./invitations-list"
import { InviteUserDialog } from "./invite-user-dialog"
import { AddUserDialog } from "./add-user-dialog"
import { UserType } from "@/lib/db/schema"
import { DataTable } from "../user/datatableUser"
import { UsersColumns } from "../user/columnsUser"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
interface UserManagementProps {
users : UserType[],
 pageNumber: number;
  numberOfPages: number;
  search: string | null;
  size: string;
  column: string;
  pathname: string;
  order: string;
}
export function UserManagement({ users ,column,numberOfPages,order,pageNumber,pathname,search }: UserManagementProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [allColumns, setAllColumns] = React.useState<ColumnDef<any>[]>([]);
   React.useEffect(() => {
    setAllColumns([
      ...UsersColumns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: any) => {
          return (
         <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => console.log("Edit user", row.id)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={row.isDisabled === false}
                          onClick={() => console.log("Activate user", row.id)}
                        >
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={row.isDisabled === true}
                          onClick={() => console.log("Deactivate user", row.id)}
                        >
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => console.log("Delete user", row.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
          );
        },
      },
    ]);
  }, [UsersColumns]);
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
          <DataTable
          column={column}
          order={order}
          pathname={pathname}
          pageNumber={pageNumber}
          numberOfPages={numberOfPages}
          search={search}
          data={users}
          size={"10"}
          columns={allColumns} />
          {/* <UsersList users={users} searchQuery={searchQuery} /> */}
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
