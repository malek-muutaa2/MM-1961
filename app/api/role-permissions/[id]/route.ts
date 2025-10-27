import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { rolePermission } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const rolePermissionId = Number.parseInt(params.id)
        console.log("rolePermissionId", rolePermissionId)
        const deletedRolePermission = await db
            .delete(rolePermission)
            .where(eq(rolePermission.permission_id, rolePermissionId))
            .returning()

        if (!deletedRolePermission.length) {
            return NextResponse.json({ error: "Role permission not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Role permission deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error deleting role permission:", error)
        return NextResponse.json({ error: "Failed to delete role permission" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const rolePermissionId = Number.parseInt(params.id)

        const updatedRolePermission = await db
            .update(rolePermission)
            .set({
                updated_at: new Date(),
                updated_by: user.id,
            })
            .where(eq(rolePermission.id, rolePermissionId))
            .returning()

        if (!updatedRolePermission.length) {
            return NextResponse.json({ error: "Role permission not found" }, { status: 404 })
        }

        return NextResponse.json({ rolePermission: updatedRolePermission[0] }, { status: 200 })
    } catch (error) {
        console.error("Error updating role permission:", error)
        return NextResponse.json({ error: "Failed to update role permission" }, { status: 500 })
    }
}
