import {db} from "@/lib/db/dbpostgres"

import {permission, rolePermission, userPermission, userRole} from "@/lib/db/schema"

import {eq, and} from "drizzle-orm"
import {AppAbility, defineAbilityFor} from "@/lib/casl/ability"

/**

 * Build CASL ability from database permissions for a specific user

 * @param userId - The user ID to fetch permissions for

 * @returns CASL Ability object with user's permissions

 */

export async function buildAbilityForUser(userId: number): Promise<AppAbility> {
    console.log("fuction started")
    console.log("User ID:", userId)
    try {
        // 1. Get user's roles
        if (!userId || userId === 0) {
                console.log("No userId provided, returning empty ability")
            return defineAbilityFor([])
        }
        const userRoles = await db
            .select({role_id: userRole.role_id})
            .from(userRole)
            .where(eq(userRole.user_id, userId))

        // console.log("userRoles :::", userRoles)

        const roleIds = userRoles.map((ur) => ur.role_id)
        // 2. Get permissions from roles
        // console.log("roleIdss :", roleIds)
        const rolePermissions =
            roleIds.length > 0
                ? await db
                    .select({
                        domain: permission.domain,
                        action: permission.action,
                        constraints: rolePermission.constraints,
                    })
                    .from(rolePermission)
                    .innerJoin(permission, eq(rolePermission.permission_id, permission.permission_id))
                    .where(and(...roleIds.map((roleId) => eq(rolePermission.role_id, roleId))))
                : []

        // 3. Get direct user permissions (not revoked)
        // console.log("rolePermissions :", rolePermissions)
        const directUserPermissions = await db
            .select({
                domain: permission.domain,
                action: permission.action,
                constraints: userPermission.constraints,
            })
            .from(userPermission)
            .innerJoin(permission, eq(userPermission.permission_id, permission.permission_id))
            .where(and(eq(userPermission.user_id, userId), eq(userPermission.revoked, false)))

        // console.log("directUserPermissions :", directUserPermissions)
        // 4. Combine all permissions

        const allPermissions = [...rolePermissions, ...directUserPermissions]
        // console.log("allPermissions :", allPermissions)
        // 5. Build and return the ability

        return defineAbilityFor(allPermissions)

    } catch (error: any) {

        console.error(" Error building ability for user:", error?.message)
        // Return an ability with no permissions on error
        const {defineAbilityFor} = await import("@/lib/casl/ability")

        return defineAbilityFor([])

    }

}

/**

 * Check if a user has a specific permission

 * @param userId - The user ID

 * @param action - The action to check (create, read, update, delete, manage)

 * @param subject - The subject/domain to check

 * @returns boolean indicating if user has permission

 */

export async function checkUserPermission(userId: number, action: string, subject: string): Promise<boolean> {

    const ability = await buildAbilityForUser(userId)

    return ability.can(action as any, subject as any)

}
