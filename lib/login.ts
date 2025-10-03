"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { LoginSchema } from "./zodschema";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { db } from "./db/dbpostgres";
import { findUniqueUser } from "./user";

export const login = async (
  values: z.infer<typeof LoginSchema>,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides !" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await findUniqueUser(email);
  // console.log(existingUser)
  if (!existingUser[0]?.email || !existingUser[0]?.password) {
    return { error: "Utilisateur non trouvé." };
  }
  if (existingUser[0].isDisabled === true) {
    return { error: "Le compte est désactivé." };
  }
  if (existingUser[0].deleted_at !== null) {
    return { error: "Le compte n'existe pas." };
  }
  if (password) {
    const isMatch = await bcrypt.compare(password, existingUser[0]?.password);
    if (!isMatch) {
      // If the passwords do not match, return null to indicate unsuccessful authentication
      return { error: "Mot de passe incorrect." };
    }

    if (!existingUser[0].isTwoFactorEnabled) {
      return {
        twoFactor: true,
        twofactorwithqr: true,
        success: "Connexion réussie.",
      };
    }
  }

  return { twoFactor: true, success: "Connexion réussie." };
};
export const DisabledUserAction = async (email: string) => {
  const existingUser = await findUniqueUser(email);

  if (!existingUser[0]?.email || !existingUser[0]?.password) {
    return { error: "L'email n'existe pas !" };
  }
  await db
      .update(users)
      .set({ isDisabled: true })
      .where(eq(users.email, email));

  return { success: "Désactivé avec succès" };
};
//function to enable user
