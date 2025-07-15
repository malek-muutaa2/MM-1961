"use server"
import { Client } from 'pg';
import { Resend } from 'resend';
import { db } from './db/dbpostgres';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

const client = new Client({
  connectionString: process.env.DATABASE_URL!.replace('-pooler', ''),
});


const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXTAUTH_URL;

let listenerStarted = false;

export async function startNotificationListener() {
  if (listenerStarted) return; // Avoid re-running in hot reload/dev
  listenerStarted = true;

  await client.connect();
  await client.query('LISTEN notifications');

  client.on('notification', async (msg) => {
    if (!msg.payload) return;
    const notification = JSON.parse(msg.payload);

    // You may also fetch user email from DB if not included in the notification
    const userEmail = notification.user_id || await getUserEmail(notification.user_id);
    if (!userEmail) return;
    console.log("Sending email to:", userEmail);
    
    await resend.emails.send({
    from: "Muutaa Inc. Optivian <muutaa@no-reply.demandamp.plus>",
        to: userEmail,
      subject: notification.title || '📬 New Notification',
      html: `<p>${notification.message || 'You have a new notification.'}</p>`,
    });
  });
}

async function getUserEmail(userId: number): Promise<string | null> {
  const res = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  return res[0]?.email || null;
}
