import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/dbpostgres';
import { notifications, users } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const { userIds, typeId, title, message, redirectUrl, data } = await req.json();

  if (!Array.isArray(userIds) || !typeId || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 1️⃣ Insert notifications
  const rows = userIds.map((uid: number) => ({
    user_id: uid,
    type_id: typeId,
    title,
    message,
    redirect_url: redirectUrl ?? null,
    data: data ?? {},
  }));
  const newNotifications = await db.insert(notifications).values(rows).returning();

  // 2️⃣ Fetch user emails for all IDs
  const userEmails = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(inArray(users.id, userIds),
);

  const batchRequests = userEmails.map(({ email }) => ({
    from: "Muutaa Inc. Optivian <muutaa@no-reply.demandamp.plus>",
    to: email,
    subject: title,
    html: `<p>${message}</p><p><a href="${redirectUrl}">View</a></p>`,
  }));

  // 3️⃣ Send all emails via batch
  try {
    const result = await resend.batch.send(batchRequests);
    console.log('Batch email send result:', result);

    return NextResponse.json({
      success: true,
      notifications: newNotifications,
      emailResult: result.data,
    });
  } catch (err) {
    console.error('Batch email failed:', err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
