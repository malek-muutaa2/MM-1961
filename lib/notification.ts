import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "./db/dbpostgres";
import {  notifications, notificationTypes } from "./db/schema";



export type Notification = {
      id: number;
    userId: number;
    typeId: number;
    title: string;
    message: string;
    redirectUrl: string | null;
    data: unknown;
    readAt: Date | null;
    createdAt: Date;
    typeName: string | null;
    };
export const getNotificationByUserId = async (userId: number) => {
const res :Notification[] =  await db.select({
    id: notifications.id,
    userId: notifications.user_id,
    typeId: notifications.type_id,
    title: notifications.title,
    message: notifications.message,
    redirectUrl: notifications.redirect_url,
    data: notifications.data,
    readAt: notifications.read_at,
    createdAt: notifications.created_at,
    typeName: notificationTypes.name,
})
  .from(notifications)
  .leftJoin(notificationTypes, eq(notifications.type_id, notificationTypes.id))
    .where(eq(notifications.user_id, userId))
    .orderBy(desc(notifications.created_at))
    .limit(100);


  return res;
}
export const CountUnreadNotifications = async (userId: number) => {
  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.user_id, userId),
    isNull(notifications.read_at)
    ))
  return result[0]?.count ?? 0;
};