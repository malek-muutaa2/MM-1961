import { getCurrentUser } from "@/lib/getCurrentUser"
import { redirect } from "next/navigation"
import { RolesTable } from "@/components/roles/roles-table"
import { buildAbilityForUser } from "@/lib/casl/ability-builder"
import { AccessDeniedPage } from "@/components/AccessDenied"

export default async function RolesPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string; search?: string; column?: string; order?: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const ability = await buildAbilityForUser(user.id)

  if (!ability.can("read", "Admin")) {
    return <AccessDeniedPage />
  }

  const page = Number.parseInt(searchParams.page || "1")
  const size = Number.parseInt(searchParams.size || "10")
  const search = searchParams.search || ""
  const column = searchParams.column || "role_id"
  const order = searchParams.order || "desc"

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Roles Management</h1>
        <p className="text-muted-foreground mt-2">Manage system roles and user assignments</p>
      </div>
      <RolesTable pageNumber={page} size={size} search={search} column={column} order={order} />
    </div>
  )
}
