import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/dbpostgres';
import { notifications, users } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import { Resend } from 'resend';
import { fetchUsersnotificationSettings, UserNotificationSettings } from '@/lib/notification';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  // Create a list of user IDs as an array of numbers
  const userIdList: number[] = Array.isArray(userIds) ? userIds.map(Number) : [];

  const userEmailsRaw = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(inArray(users.id, userIdList));

  const notificationSettings: UserNotificationSettings[] = await fetchUsersnotificationSettings(userIdList);

  // Only keep userEmails where id matches a user_id in notificationSettings
  const allowedUserIds = new Set(notificationSettings.map(ns => ns.user_id));
  const userEmails = userEmailsRaw.filter(user => allowedUserIds.has(user.id));
console.log("userEmails", userEmails);

const batchRequests = userEmails.map(({ email }) => ({
    from: "Muutaa Inc. Optivian <muutaa@no-reply.demandamp.plus>",
  to: email,
  subject: title,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
        <tr><td align="center" style="padding:20px 0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="background:#004080; padding:20px; text-align:center;">
                <h1 style="color:#ffffff; font-size:24px; margin:0;">${title}</h1>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding:20px; color:#333333; font-size:16px; line-height:1.5;">
                <p>${message}</p>
              </td>
            </tr>
            <!-- CTA Button -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <a href="${redirectUrl}" style="
                  background:#004080;
                  color:#ffffff;
                  padding:12px 24px;
                  text-decoration:none;
                  border-radius:4px;
                  display:inline-block;
                  font-size:16px;">View Notification</a>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0; padding:16px; text-align:center; font-size:12px; color:#777777;">
                <p style="margin:0;">© ${new Date().getFullYear()} Muutaa Inc.</p>
                <p style="margin:4px 0 0;">If you no longer wish to receive these emails, you can unsubscribe here.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `,
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
