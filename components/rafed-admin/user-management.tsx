"use client"

import React, {useState} from "react"
import {MoreHorizontal, Plus, UserCog} from "lucide-react"
import {
    ColumnDef,

} from "@tanstack/react-table";
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"

import {InvitationsList} from "./invitations-list"
import {InviteUserDialog} from "./invite-user-dialog"
import {AddUserDialog} from "./add-user-dialog"
import {UserType} from "@/lib/db/schema"
import {DataTable} from "../user/datatableUser"
import {UsersColumns} from "../user/columnsUser"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu"
import {useToast} from "@/hooks/use-toast";
import {ActivateUser, deleteUser} from "@/lib/user";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog";
import {EditUserDialog} from "./edit-user-dialog";

interface UserManagementProps {
    users: UserType[],
    pageNumber: number;
    numberOfPages: number;
    search: string | null;
    column: string;
    pathname: string;
    order: string;

}


export function UserManagement({
                                   users,
                                   column,
                                   numberOfPages,
                                   order,
                                   pageNumber,
                                   pathname,
                                   search,
                               }: Readonly<UserManagementProps>) {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    let [isPending, startTransition] = React.useTransition();
    const {toast} = useToast();

    console.log("setSearchQuery", setSearchQuery);

    React.useEffect(() => {
        if (isPending) return;


    }, [isPending]);
    const [dialog, setDialog] = useState<any>({
        open: false,
        userId: null,
        action: "",
    });
    const [editingUser, setEditingUser] = useState<UserType | null>(null)

    const handleConfirm = () => {
        if (dialog.action === "activate") ActivateUserAction(dialog.userId, false);
        if (dialog.action === "deactivate") ActivateUserAction(dialog.userId, true);
        if (dialog.action === "delete") deleteUserAction(dialog.userId); // Assuming delete also disables
        setDialog({open: false, userId: null, action: ""});
    };
    const deleteUserAction = async (userId: number) => {

        // Simulate API call to delete user
        console.log(`Deleting user with ID: ${userId}`);

        startTransition(async () => {
                try {
                    await deleteUser(userId)
                        .then(() => {
                            console.log("User deleted successfully");
                            toast({
                                title: "Success",
                                description: "User deleted successfully.",
                                variant: "default",
                            });
                        })


                } catch (error) {
                    console.error("Error deleting user:", error);
                    toast({
                        title: "Error",
                        description: "Failed to delete user.",
                        variant: "destructive",
                    });
                }
            }
        )
    }
    const ActivateUserAction = async (userId: number, isActivate: boolean) => {
        // Simulate API call to activate user
        console.log(`Activating user with ID: ${userId}, isActivate: ${isActivate}`);

        startTransition(async () => {
            try {
                await ActivateUser(isActivate, userId)
                    .then(() => {
                        console.log("User activated successfully");
                        toast({
                            title: "Success",
                            description: isActivate ? "User dactivated successfully" : "User activated successfully.",
                            variant: "default",
                        });
                    })


            } catch (error) {
                console.error("Error activating user:", error);
                toast({
                    title: "Error",
                    description: "Failed to activate user.",
                    variant: "destructive",
                });
            }


        })
    }
    const [allColumns, setAllColumns] = React.useState<ColumnDef<any>[]>([]);
    React.useEffect(() => {
        setAllColumns([
            ...UsersColumns,
            {
                id: "actions",
                header: "Actions",
                cell: ({row}: any) => { // NOSONAR
                    console.log("row", row.original);

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setEditingUser(row.original)}>
                                    <UserCog className="mr-2 h-4 w-4"/>
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    disabled={row.original.isDisabled === false}
                                    onClick={() =>
                                        setDialog({open: true, userId: row.original.id, action: "activate"})
                                    }
                                >
                                    Activate
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    disabled={row.original.isDisabled === true}
                                    onClick={() =>
                                        setDialog({open: true, userId: row.original.id, action: "deactivate"})
                                    }
                                >
                                    Deactivate
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() =>
                                        setDialog({open: true, userId: row.original.id, action: "delete"})
                                    }
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
    console.log("editingUser", editingUser);

    return (
        <div className="space-y-6">
            {editingUser && (
                <EditUserDialog
                    user={editingUser}
                    open={!!editingUser}
                    onOpenChange={(open) => {
                        if (!open) setEditingUser(null)
                    }}
                />
            )}
            <Dialog open={dialog.open} onOpenChange={(open) => setDialog({...dialog, open})}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Confirm {dialog.action.charAt(0).toUpperCase() + dialog.action.slice(1)}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {dialog.action} this user?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialog({...dialog, open: false})}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Tabs defaultValue="users">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="invitations">Invitations</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                        <div className="relative">

                        </div>

                        <Button onClick={() => setAddUserDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4"/>
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
                        columns={allColumns}/>
                    {/* <UsersList users={users} searchQuery={searchQuery} /> */}
                </TabsContent>
                <TabsContent value="invitations" className="mt-6">
                    <InvitationsList searchQuery={searchQuery}/>
                </TabsContent>
            </Tabs>

            <InviteUserDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}/>
            <AddUserDialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}/>
        </div>

    )
}
