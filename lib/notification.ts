"use server";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "./db/dbpostgres";
import {  notifications, notificationTypes } from "./db/schema";
import { use } from "react";
import { revalidatePath } from "next/cache";



export type Notification = {
      id: number;
    userId: number;
    typeId: number;
    title: string;
    message: string;
    redirectUrl: string | null;
    data: unknown;
    readAt: Date | null;
    created_at: Date;
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
    created_at: notifications.created_at,
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

export const markNotificationAsRead = async (notificationId: number) => {
  const result = await db
    .update(notifications)
    .set({ read_at: new Date() })
    .where(eq(notifications.id, notificationId))
    .returning();

  return result[0];
}
export const markAllNotificationsAsRead = async (userId: number) => {
  const result = await db
    .update(notifications)
    .set({ read_at: new Date() })
    .where(eq(notifications.user_id, userId))
    .returning();

  return result;
}
export type NotificationType = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: Date;
};
export const notificationTypesList = async () => {
  const res = await db.select().from(notificationTypes);
  return res;
}
export const markasread  = async (userId: number) => {
  const res = await markAllNotificationsAsRead(userId);
     revalidatePath('/', 'layout')
  
    return{ sucess: "Notification marked as read", notification: res };
}