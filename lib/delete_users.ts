import { twoFactorAuth, users } from "@/lib/db/schema";
import { eq, and, lte, isNotNull, isNull } from "drizzle-orm";
import { subDays } from "date-fns";
import { db } from "./db/dbpostgres";

export async function permanentlyDeleteUsers() {
  const cutoff = subDays(new Date(), 30);

  const oldUsers = await db.select()
    .from(users)
    .where(
      and(
        eq(users.isDisabled, true),
        isNotNull(users.deactivated_at),
        lte(users.deactivated_at, cutoff),
        isNull(users.deleted_at)
      )
    );

  for (const user of oldUsers) {
    console.log(`Permanently deleting user: ${user.email}`);
await db.transaction(async (tx) => {
  await tx.delete(twoFactorAuth)
    .where(eq(twoFactorAuth.userId, user.id));

  await tx.delete(users)
    .where(eq(users.id, user.id));
});


  }
}
