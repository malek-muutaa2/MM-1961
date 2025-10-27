import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { userRole } from "@/lib/db/schema"
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

        const userRoleId = Number.parseInt(params.id)

        // Soft delete
        const deletedUserRole = await db
            .update(userRole)
            .set({
                deleted_at: new Date(),
                deleted_by: user.id,
                updated_by: user.id,
                updated_at: new Date(),
            })
            .where(eq(userRole.id, userRoleId))
            .returning()

        if (!deletedUserRole.length) {
            return NextResponse.json({ error: "User role not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "User role removed successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error removing user role:", error)
        return NextResponse.json({ error: "Failed to remove user role" }, { status: 500 })
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

        const userRoleId = Number.parseInt(params.id)
        const body = await request.json()
        const { role_id } = body

        if (!role_id) {
            return NextResponse.json({ error: "Role ID is required" }, { status: 400 })
        }

        const updatedUserRole = await db
            .update(userRole)
            .set({
                role_id,
                updated_at: new Date(),
                updated_by: user.id,
            })
            .where(eq(userRole.id, userRoleId))
            .returning()

        if (!updatedUserRole.length) {
            return NextResponse.json({ error: "User role not found" }, { status: 404 })
        }

        return NextResponse.json({ userRole: updatedUserRole[0] }, { status: 200 })
    } catch (error) {
        console.error("Error updating user role:", error)
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }
}
