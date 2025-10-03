import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { classifications } from "@/lib/db/schema"

export async function GET() {
    try {
        const data = await db.select().from(classifications)
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching classifications:", error)
        return NextResponse.json({ error: "Failed to fetch classifications" }, { status: 500 })
    }
}
