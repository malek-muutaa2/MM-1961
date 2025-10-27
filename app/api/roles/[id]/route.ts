import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { roles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const roleId = Number.parseInt(params.id)
        const role = await db.select().from(roles).where(eq(roles.role_id, roleId))

        if (!role.length) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 })
        }

        return NextResponse.json({ role: role[0] }, { status: 200 })
    } catch (error) {
        console.error("Error fetching role:", error)
        return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 })
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

        const roleId = Number.parseInt(params.id)
        const body = await request.json()
        const { name, description } = body

        const updatedRole = await db
            .update(roles)
            .set({
                name: name || undefined,
                description: description || undefined,
                updated_at: new Date(),
                updated_by: user.id,
            })
            .where(eq(roles.role_id, roleId))
            .returning()

        if (!updatedRole.length) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 })
        }

        return NextResponse.json({ role: updatedRole[0] }, { status: 200 })
    } catch (error) {
        console.error("Error updating role:", error)
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (user.role !== "Admin") {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 })
        }

        const roleId = Number.parseInt(params.id)

        const deletedRole = await db
            .update(roles)
            .set({
                deleted_at: new Date(),
                deleted_by: user.id,
            })
            .where(eq(roles.role_id, roleId))
            .returning()

        if (!deletedRole.length) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error deleting role:", error)
        return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
    }
}
