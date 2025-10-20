import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { db } from "@/lib/db/dbpostgres"
import { roles } from "@/lib/db/schema"

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

        // Fetch all roles from the database
        const allRoles = await db.select().from(roles)

        return NextResponse.json({ roles: allRoles }, { status: 200 })
    } catch (error) {
        console.error("Error fetching roles:", error)
        return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
    }
}
