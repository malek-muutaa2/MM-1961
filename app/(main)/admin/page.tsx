import type { Metadata } from "next"

import { UserManagement } from "@/components/rafed-admin/user-management"
import { getusers, TotalUsers } from "@/lib/user"
import { UserType } from "@/lib/db/schema"
import { SearchParamsProps } from "@/lib/type"
import { db } from "@/lib/db/dbpostgres"
import { users as UserList} from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import {getCurrentUser} from "@/lib/getCurrentUser";
import {redirect} from "next/navigation";
import {AdminPortalDashboard} from "@/components/admin-portal/admin-portal-dashboard";
import {buildAbilityForUser} from "@/lib/casl/ability-builder";
import {AccessDeniedPage} from "@/components/AccessDenied";
export const metadata: Metadata = {
    title: "User Management | Rafed Admin",
    description: "Manage users, invite providers and suppliers, and add administrators",
}

export default async function AdminHome({
                                           searchParams,
                                       }: Readonly<SearchParamsProps>) {

    const { page, column, order, search } = searchParams;
    const pageNumber = Number(page ?? 1);
    const sizelimit = 10;
    const columnparam = String(column ?? "id");
    const orderparam = String(order ?? "undefined");
    const prevSearchParams = new URLSearchParams();
    const nextSearchParams = new URLSearchParams();
    let safePageNumber = 1;
    const numberOfItems = sizelimit;
    const searchparam =
        typeof search === "string" ? search : null;
    const offsetItems = (Number(pageNumber) - 1) * numberOfItems;
    const Total = await TotalUsers(search)
    const users: UserType[] = await getusers(
        offsetItems,
        searchparam,
        numberOfItems,
        columnparam,
        orderparam,
    );
    const numberOfPages = Total[0]?.count
        ? Math.ceil(Total[0]?.count / numberOfItems)
        : 1;

    if (safePageNumber > 2) {
        prevSearchParams.set("numberOfItems", `${numberOfItems}`);
        prevSearchParams.set("page", `${safePageNumber - 1}`);
    } else {
        prevSearchParams.delete("page");
    }

    if (safePageNumber > 0) {
        if (safePageNumber === numberOfPages) {
            nextSearchParams.set("page", `${numberOfPages}`);
        } else {
            nextSearchParams.set("page", `${safePageNumber + 1}`);
        }
        nextSearchParams.set("numberOfItems", `${numberOfItems}`);
    } else {
        nextSearchParams.delete("page");
    }


    const currentUser = await getCurrentUser()

    // Check if user is authenticated
    if (!currentUser) {
        redirect("/login")
    }

    // Build user's ability based on their roles and permissions
    const ability = await buildAbilityForUser(currentUser.id)

    // Check if user has admin access (read permission on Admin domain)
    if (!ability.can("read", "Admin")) {
        return <AccessDeniedPage/>
    }

    // Fetch admin statistics
    const totalUsersData = await TotalUsers()
    const totalUsers = totalUsersData[0]?.count || 0

    // Get recent users (last 5)
    const recentUsers: UserType[] = await getusers(0, null, 5, "createdAt", "desc")


    const roleStats = await db
        .select({
            role: UserList.role,
            count: sql<number>`count(*)::int`,
        })
        .from(UserList)

        .groupBy(UserList.role)

    const activeSessionsData = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(UserList)
        .where(sql`${UserList.last_login} > NOW() - INTERVAL '24 hours' AND ${UserList.deleted_at} IS NULL`)

    const activeSessions = activeSessionsData[0]?.count || 0


    return (
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage users, invite providers and suppliers, and add administrators</p>
            </div>
            <UserManagement
                column={columnparam}
                numberOfPages={numberOfPages}
                order={orderparam}
                pageNumber={pageNumber}
                pathname="/admin"
                search={search}
                size="10"

                users={users} />
            <AdminPortalDashboard
                currentUser={currentUser}
                totalUsers={totalUsers}
                recentUsers={recentUsers}
                roleStats={roleStats}
                activeSessions={activeSessions}
            />

        </div>
    )
}
