import type { Metadata } from "next"

import { UserManagement } from "@/components/rafed-admin/user-management"

export const metadata: Metadata = {
  title: "User Management | Rafed Admin",
  description: "Manage users, invite providers and suppliers, and add administrators",
}

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users, invite providers and suppliers, and add administrators</p>
      </div>
      <UserManagement />
    </div>
  )
}
