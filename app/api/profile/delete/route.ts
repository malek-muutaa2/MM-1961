import { db } from "@/lib/db/dbpostgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  // Mark user as deactivated
  await db.update(users)
    .set({
      isDisabled: true,
      deactivated_at: new Date()
    })
    .where(eq(users.email, session.user.email))

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
