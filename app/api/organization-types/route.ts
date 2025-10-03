import { NextResponse } from "next/server"
import { db } from "@/lib/db/dbpostgres"
import { organizationTypes } from "@/lib/db/schema"

export async function GET() {
  try {
    const orgTypes = await db.select().from(organizationTypes)

    const formattedOrgTypes = orgTypes.map((orgType) => ({
      id: orgType.id,
      name: orgType.name,
      source_types: orgType.sourceTypes as string[],
    }))

    return NextResponse.json(formattedOrgTypes)
  } catch (error) {
    console.error("Failed to fetch organization types:", error)
    return NextResponse.json({ error: "Failed to fetch organization types" }, { status: 500 })
  }
}
