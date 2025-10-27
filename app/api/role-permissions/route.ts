import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { rolePermission } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const allRolePermissions = await db.select().from(rolePermission)

        return NextResponse.json({ rolePermissions: allRolePermissions }, { status: 200 })
    } catch (error) {
        console.error("Error fetching role permissions:", error)
        return NextResponse.json({ error: "Failed to fetch role permissions" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const body = await request.json()
        const { role_id, permission_id } = body

        if (!role_id || !permission_id) {
            return NextResponse.json({ error: "Role ID and Permission ID are required" }, { status: 400 })
        }

        const newRolePermission = await db
            .insert(rolePermission)
            .values({
                role_id,
                permission_id,
                updated_by: user.id,
            })
            .returning()

        return NextResponse.json({ rolePermission: newRolePermission[0] }, { status: 201 })
    } catch (error) {
        console.error("Error creating role permission:", error)
        return NextResponse.json({ error: "Failed to create role permission" }, { status: 500 })
    }
}
