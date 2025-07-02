// app/api/user/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { UserType } from "@/lib/db/schema"
import { getusers } from "@/lib/user"
import { getNotificationByUserId } from "@/lib/notification"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
    const unread = searchParams.get("unread") ? true : false;
 const typeId = parseInt(searchParams.get("typeId")) || null;
  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }
console.log("unreadunread", unread);

  // strip out any sensitive fields if needed
  const notifications  = await getNotificationByUserId(user?.id,page, size,unread,typeId)

  return NextResponse.json({ notifications: notifications }, { status: 200 })
}
