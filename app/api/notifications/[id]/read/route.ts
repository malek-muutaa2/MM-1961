// app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/dbpostgres';
import { notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
const { id } = params;
  const notificationId = Number(id);
  if (!notificationId || isNaN(notificationId)) {
    return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
  }

  const now = new Date();
  const result = await db
    .update(notifications)
    .set({ read_at: now })
    .where(eq(notifications.id, notificationId))
    .returning();

  if (result.length === 0) {
    return NextResponse.json(
      { error: 'Notification not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, notification: result[0] }
  );
}
