"use server";

import * as z from "zod";

import speakeasy from "speakeasy";
import { UpdateUser2F, findUniqueUser } from "./api";
import { TwoFASchema } from "./zodschema";
type credentials = {
  email: string;
  password: string;
};
export const verification2fa = async (
  values: z.infer<typeof TwoFASchema>,
  secretbase32: string,
  credentials: credentials,
) => {
  const validatedFields = TwoFASchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { code } = validatedFields.data;

  const verified = speakeasy.totp.verify({
    secret: secretbase32,
    encoding: "base32",
    token: code,
  });
  if (verified) {
    if (credentials.email) {
      await UpdateUser2F(secretbase32, credentials.email);
    }
    return { success: "2FA vérifié avec succès" };
  } else {
    return { error: "Jeton 2FA invalide" };
  }


};

export const verification2fa2 = async (
  values: z.infer<typeof TwoFASchema>,
  credentials: credentials,
) => {
  const validatedFields = TwoFASchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { code } = validatedFields.data;
  const existingUser = await findUniqueUser(credentials.email);
  if (existingUser[0].totpSecret) {
    const verified = speakeasy.totp.verify({
      secret: existingUser[0].totpSecret,
      encoding: "base32",
      token: code,
    });
    console.log("verified", verified);
    if (verified) {
      return { success: "2FA vérifié avec succès" };
    } else {
      return { error: "Jeton 2FA invalide" };
    }
  }


};
