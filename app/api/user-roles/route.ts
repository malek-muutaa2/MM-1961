import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { userRole, users, roles } from "@/lib/db/schema"
import { eq, and, isNull } from "drizzle-orm"

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

    const { searchParams } = new URL(request.url)
    const roleIdParam = searchParams.get("role_id")

    let query = db
      .select({
        user_role_id: userRole.id,
        user_id: userRole.user_id,
        role_id: userRole.role_id,
        user_name: users.name,
        user_email: users.email,
        role_name: roles.name,
        created_at: userRole.created_at,
        updated_at: userRole.updated_at,
        created_by: userRole.created_by,
      })
      .from(userRole)
      .leftJoin(users, eq(userRole.user_id, users.id))
      .leftJoin(roles, eq(userRole.role_id, roles.role_id))
      .where(isNull(userRole.deleted_at))

    if (roleIdParam) {
      const roleId = Number.parseInt(roleIdParam)
      query = query.where(eq(userRole.role_id, roleId))
    }

    const allUserRoles = await query

    return NextResponse.json({ userRoles: allUserRoles }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user roles:", error)
    return NextResponse.json({ error: "Failed to fetch user roles" }, { status: 500 })
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
    const { user_id, role_id } = body

    if (!user_id || !role_id) {
      return NextResponse.json({ error: "User ID and Role ID are required" }, { status: 400 })
    }

    // Check if user already has this role
    const existingUserRole = await db
      .select()
      .from(userRole)
      .where(and(eq(userRole.user_id, user_id), eq(userRole.role_id, role_id), isNull(userRole.deleted_at)))

    if (existingUserRole.length > 0) {
      return NextResponse.json({ error: "User already has this role" }, { status: 400 })
    }

    const newUserRole = await db
      .insert(userRole)
      .values({
        user_id,
        role_id,
        created_by: user.id,
        updated_by: user.id,
      })
      .returning()

    return NextResponse.json({ userRole: newUserRole[0] }, { status: 201 })
  } catch (error) {
    console.error("Error assigning role to user:", error)
    return NextResponse.json({ error: "Failed to assign role to user" }, { status: 500 })
  }
}
