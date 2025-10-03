// app/api/user/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { UserType } from "@/lib/db/schema"
import { getusers } from "@/lib/user"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }
if (user.role !== "Admin") {
    return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 }
    )
}
  // strip out any sensitive fields if needed
  const users : UserType[] = await getusers()

  return NextResponse.json({ user: users }, { status: 200 })
}
