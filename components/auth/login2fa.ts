"use server";

import { z } from "zod";



import bcrypt from "bcrypt";
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

export const Login2fa2 = async (
  values: z.infer<typeof LoginSchema>,
  
) => {
  const validatedFields = LoginSchema.safeParse(values);

if (!validatedFields.success) {
    return { error: "Invalid fields!" };
}
const { email, password, code } = validatedFields.data;
const existingUser = await findUniqueUser(email);
if (!existingUser[0] || !existingUser[0].email || !existingUser[0].password) {
    return { error: "User not found." };
}
if (existingUser[0].isDisabled === true) {
    return { error: "Account is disabled." };
}
if (existingUser[0].deleted_at !== null) {
    return { error: "Account does not exist." };
}
if (password) {
    const isMatch = await bcrypt.compare(password, existingUser[0]?.password);
    if (!isMatch) {
        // If the passwords do not match, return null to indicate unsuccessful authentication
        return { error: "Incorrect password." };
    }

    if (!existingUser[0].isTwoFactorEnabled) {
        const passwordupdateat = new Date(existingUser[0].passwordupdatedat);
        passwordupdateat.setMonth(passwordupdateat.getMonth() + 8);
        const isexpired = passwordupdateat < new Date();

        if (isexpired) {
            const passwordResetToken = await generatePasswordResetToken(email);
            return {
              error: "Password has expired. Please reset your password.",
              isexpired: true,
              passwordResetToken: passwordResetToken[0].resetpasswordtoken,
            };
        }
        return {
            success: "Two-factor authentication is enabled but without QR code.",
        };
    }
}

if (code) {
    const twoFactorToken =  await db.select().from(twoFactorAuth).where(
        eq(twoFactorAuth.userId, existingUser[0].id))

    if (!twoFactorToken[0]) {
        return { error: "Invalid code!" };
    }
    const isMatch = await bcrypt.compare(
        code,
        twoFactorToken[0].twoFactorToken,
    );

    if (!isMatch) {
        return { error: "Invalid two-factor authentication code." };
    }

    const hasExpired =
        new Date(twoFactorToken[0].TwoFactorTokenExpiry) < new Date();

    if (hasExpired) {
        return { error: "Two-factor authentication code has expired." };
    }

    await db
        .update(twoFactorAuth)
        .set({ twoFactorToken: "", twoFactorTokenExpiry: null})
        .where(eq(twoFactorAuth.userId, existingUser[0].id));
    return { success: "Two-factor authentication successful." };
}
  else {
    const passwordupdateat = new Date(existingUser[0].passwordupdatedat);
    passwordupdateat.setMonth(passwordupdateat.getMonth() + 8);
    const isexpired = passwordupdateat < new Date();

    if (isexpired) {
      const passwordResetToken = await generatePasswordResetToken(email);
      return {
        error: "password has expired. Please reset your password.",
        isexpired: true,
        passwordResetToken: passwordResetToken[0].resetpasswordtoken,
      };
    }
    const twoFactorToken = await generateTwoFactorToken(existingUser[0].id,existingUser[0].email);

    if (twoFactorToken) {
      await sendTwoFactorTokenEmail(
        existingUser[0].email,
        twoFactorToken.token,
        "en"
        
      );

      return { twoFactor: true };
    }
  }
};
