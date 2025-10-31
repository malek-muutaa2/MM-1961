import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { permission } from "@/lib/db/schema"
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

    const permissionId = Number.parseInt(params.id)
    const perm = await db.select().from(permission).where(eq(permission.permission_id, permissionId))

    if (!perm.length) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    return NextResponse.json({ permission: perm[0] }, { status: 200 })
  } catch (error) {
    console.error("Error fetching permission:", error)
    return NextResponse.json({ error: "Failed to fetch permission" }, { status: 500 })
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

    const permissionId = Number.parseInt(params.id)
    const body = await request.json()
    const { domain, action, description } = body

    const updatedPermission = await db
      .update(permission)
      .set({
        domain: domain || undefined,
        action: action || undefined,
        description: description || undefined,
        updated_at: new Date(),
        updated_by: user.id,
      })
      .where(eq(permission.permission_id, permissionId))
      .returning()

    if (!updatedPermission.length) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    return NextResponse.json({ permission: updatedPermission[0] }, { status: 200 })
  } catch (error) {
    console.error("Error updating permission:", error)
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 })
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

    const permissionId = Number.parseInt(params.id)

    const { rolePermission } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const assignedRoles = await db.select().from(rolePermission).where(eq(rolePermission.permission_id, permissionId))

    if (assignedRoles.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete permission. It is assigned to ${assignedRoles.length} role(s).` },
        { status: 400 },
      )
    }

    const deletedPermission = await db
      .update(permission)
      .set({
        deleted_at: new Date(),
        deleted_by: user.id,
      })
      .where(eq(permission.permission_id, permissionId))
      .returning()

    if (!deletedPermission.length) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Permission deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting permission:", error)
    return NextResponse.json({ error: "Failed to delete permission" }, { status: 500 })
  }
}
