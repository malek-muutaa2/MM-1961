import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { userRole } from "@/lib/db/schema"
import { eq, and, inArray, isNull } from "drizzle-orm"

export const dynamic = "force-dynamic"

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
    const { role_id, user_ids } = body

    if (!role_id || !Array.isArray(user_ids)) {
      return NextResponse.json({ error: "Role ID and user IDs array are required" }, { status: 400 })
    }

    // Get current assignments
    const currentAssignments = await db
      .select({ user_id: userRole.user_id })
      .from(userRole)
      .where(and(eq(userRole.role_id, role_id), isNull(userRole.deleted_at)))

    const currentUserIds = new Set(currentAssignments.map((a) => a.user_id))
    const newUserIds = new Set(user_ids)

    // Remove assignments that are no longer selected
    const toRemove = Array.from(currentUserIds).filter((id) => !newUserIds.has(id))
    if (toRemove.length > 0) {
      await db
        .update(userRole)
        .set({
          deleted_at: new Date(),
          deleted_by: user.id,
        })
        .where(and(eq(userRole.role_id, role_id), inArray(userRole.user_id, toRemove)))
    }

    // Add new assignments
    const toAdd = Array.from(newUserIds).filter((id) => !currentUserIds.has(id))
    if (toAdd.length > 0) {
      const newAssignments = toAdd.map((userId) => ({
        user_id: userId,
        role_id,
        created_by: user.id,
        updated_by: user.id,
      }))

      await db.insert(userRole).values(newAssignments)
    }

    return NextResponse.json({ message: "Users assigned successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error assigning users to role:", error)
    return NextResponse.json({ error: "Failed to assign users to role" }, { status: 500 })
  }
}
