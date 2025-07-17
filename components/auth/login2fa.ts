"use server";

import { z } from "zod";



import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/dbpostgres";
import { twoFactorAuth } from "@/lib/db/schema";
import { findUniqueUser, generateTwoFactorToken } from "@/lib/user";
import { generatePasswordResetToken } from "@/lib/reset";
import { LoginSchema } from "@/lib/zodschema";
import { sendTwoFactorTokenEmail } from "@/lib/mail";

type credentials = {
  email: string;
  password: string;
};
async function handlePasswordExpiry(user: any) {
  const passwordUpdatedAt = new Date(user.passwordupdatedat);
  passwordUpdatedAt.setMonth(passwordUpdatedAt.getMonth() + 8);

  if (passwordUpdatedAt < new Date()) {
    const resetToken = await generatePasswordResetToken(user.email);
    return {
      error: "Password has expired. Please reset your password.",
      isexpired: true,
      passwordResetToken: resetToken[0].resetpasswordtoken,
    };
  }

  return { success: "User authenticated successfully." };
}

async function handle2FACode(code: string, user: any) {
  const [tokenData] = await db
    .select()
    .from(twoFactorAuth)
    .where(eq(twoFactorAuth.userId, user.id));

  if (!tokenData) return { error: "Invalid code!" };

  const result = await bcrypt.compare(code, tokenData.twoFactorToken);

const isMatch = Boolean(result); // force conversion just in case

if (!isMatch) {
    return { error: "Invalid two-factor authentication code." };
}


  if (new Date(tokenData.twoFactorTokenExpiry) < new Date()) {
    return { error: "Two-factor authentication code has expired." };
  }

  await db
    .update(twoFactorAuth)
    .set({ twoFactorToken: "", twoFactorTokenExpiry: null })
    .where(eq(twoFactorAuth.userId, user.id));

  return { success: "User authenticated successfully." };
}

async function send2FACodeFlow(user: any) {
  const passwordUpdatedAt = new Date(user.passwordupdatedat);
  passwordUpdatedAt.setMonth(passwordUpdatedAt.getMonth() + 8);

  if (passwordUpdatedAt < new Date()) {
    const resetToken = await generatePasswordResetToken(user.email);
    return {
      error: "password has expired. Please reset your password.",
      isexpired: true,
      passwordResetToken: resetToken[0].resetpasswordtoken,
    };
  }

  const twoFactorToken = await generateTwoFactorToken(user.id, user.email);
  if (twoFactorToken) {
    await sendTwoFactorTokenEmail(user.email, twoFactorToken.token, "en");
    return { twoFactor: true };
  }

  return { error: "Failed to generate 2FA token." };
}

export const Login2fa2 = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, password, code } = validatedFields.data;
  const user = (await findUniqueUser(email))[0];

  if (!user?.email || !user?.password) return { error: "User not found." };
  if (user.isDisabled) return { error: "Account is disabled." };
  if (user.deleted_at !== null) return { error: "Account does not exist." };

  if (password) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { error: "Incorrect password." };

    if (!user.isTwoFactorEnabled) {
      return await handlePasswordExpiry(user);
    }
  }
   
  if (code) {
    console.log("Handling 2FA code for user:", code);
    
    return await handle2FACode(code, user);
  }

  return await send2FACodeFlow(user);
};
