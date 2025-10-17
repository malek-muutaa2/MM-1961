import { getCurrentUser } from "@/lib/getCurrentUser"
import { redirect } from "next/navigation"
import { PermissionsTable } from "@/components/permissions/permissions-table"
import {buildAbilityForUser} from "@/lib/casl/ability-builder";
import {AccessDeniedPage} from "@/components/AccessDenied";

export default async function PermissionsPage({
                                                  searchParams,
                                              }: {
    searchParams: { page?: string; size?: string; search?: string; column?: string; order?: string }
}) {
    const user = await getCurrentUser()

    // Check if user is authenticated
    if (!user) {
        redirect("/login")
    }
    // Build user's ability based on their roles and permissions
    const ability = await buildAbilityForUser(user.id)

    // Check if user has admin access (read permission on Admin domain)
    if (!ability.can("read", "Admin")) {
        return <AccessDeniedPage/>
    }


    const page = Number.parseInt(searchParams.page || "1")
    const size = Number.parseInt(searchParams.size || "10")
    const search = searchParams.search || ""
    const column = searchParams.column || "permission_id"
    const order = searchParams.order || "desc"

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Permissions Management</h1>
                <p className="text-muted-foreground mt-2">Manage system permissions and access controls</p>
            </div>
            <PermissionsTable pageNumber={page} size={size} search={search} column={column} order={order} />
        </div>
    )
}
