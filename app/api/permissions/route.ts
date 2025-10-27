import { db } from "@/lib/db/dbpostgres"
import { permission } from "@/lib/db/schema"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { NextResponse } from "next/server"
import { desc, asc, ilike, or, count } from "drizzle-orm"
import type { NextRequest } from "next/server"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== "Admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const size = Number.parseInt(searchParams.get("size") || "10")
        const search = searchParams.get("search") || ""
        const column = searchParams.get("column") || "permission_id"
        const order = searchParams.get("order") || "desc"

        const offset = (page - 1) * size

        // Build where clause for search
        const whereClause = search
            ? or(
                ilike(permission.domain, `%${search}%`),
                ilike(permission.action, `%${search}%`),
                ilike(permission.description, `%${search}%`),
            )
            : undefined

        // Get total count
        const totalCount = await db.select({ count: count() }).from(permission).where(whereClause)

        // Get permissions with pagination
        const permissions = await db
            .select()
            .from(permission)
            .where(whereClause)
            .orderBy(
                order === "asc"
                    ? asc(permission[column as keyof typeof permission])
                    : desc(permission[column as keyof typeof permission]),
            )
            .limit(size)
            .offset(offset)

        const numberOfPages = Math.ceil(totalCount[0].count / size)

        return NextResponse.json({
            permissions,
            pageNumber: page,
            numberOfPages,
            totalCount: totalCount[0].count,
        })
    } catch (error) {
        console.error("Error fetching permissions:", error)
        return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 })
    }
}



export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user || user.role !== "Admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { domain, action, description } = body

        if (!domain || !action) {
            return NextResponse.json({ error: "Domain and action are required" }, { status: 400 })
        }

        const newPermission = await db
            .insert(permission)
            .values({
                domain,
                action,
                description: description || null,
                created_by: user.id,
            })
            .returning()

        return NextResponse.json({ permission: newPermission[0] }, { status: 201 })
    } catch (error) {
        console.error("Error creating permission:", error)
        return NextResponse.json({ error: "Failed to create permission" }, { status: 500 })
    }
}
