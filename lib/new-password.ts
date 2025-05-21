"use server";

import * as z from "zod";
import bcrypt from "bcrypt";
import { NewPasswordSchema } from "./zodschema";
import { FormMessages } from "@/app/login/new-password/new-password-form";
import { findUerbyToken, findUniqueUser, updateLock, UpdateUserPassword } from "./user";


const NewPasswordSchemaServer = z.object({
  password: z
    .string()
    .min(12, {
      message: "Le mot de passe doit contenir au moins 12 caractères",
    })
    .regex(/[a-zA-Z]/, { message: "Le mot de passe doit inclure des lettres" })
    .regex(/[A-Z]/, {
      message: "Le mot de passe doit inclure au moins une lettre en majuscule",
    })
    .regex(/\d/, { message: "Le mot de passe doit inclure des chiffres" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Le mot de passe doit inclure un caractère spécial",
    }),
});

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  FormMessages: FormMessages,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Token manquant !!" };
  }

  const validatedFields = NewPasswordSchemaServer.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { password } = validatedFields.data;

  const existingToken = await findUerbyToken(token);

  if (!existingToken[0]) {
    return { error: " Token invalides !!" };
  }

  const existingUser = await findUniqueUser(existingToken[0].email);

  if (!existingUser[0]) {
    return { error: `${FormMessages.userNotFound}` };
  } else if (existingUser[0].email) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await UpdateUserPassword(hashedPassword, existingUser[0].id);
    await updateLock(false, existingUser[0]?.id);

    return { success: `${FormMessages.UpdatePass}` };
  }
};
// tests using jest
// test("newPassword", async () => {
//   const result = await newPassword({
//     password: "password",
//   });
//   expect(result).toEqual({ error: "Missing token!" });
// });
// test("newPassword", async () => {
//   const result = await newPassword({
//     password: "password",
//   }, "token
//   ");
//   expect(result).toEqual({ error: "Invalid token!" });
// });
// test("newPassword", async () => {
//   const result = await newPassword({
//     password: "password",
//   }, "token
//   ");
//   expect(result).toEqual({ error: "Invalid token!" });
// });
// test("newPassword", async () => {
//   const result = await newPassword({
//     password: "password",
//   }, "token
//   ");
//   expect(result).toEqual({ error: "Invalid token!" });
// });
// test("newPassword", async () => {
//   const result = await newPassword({
//     password: "password",
//   }, "token
//   ");
//   expect(result).toEqual({ error: "Invalid token!" });
// });
// test("newPassword", async () => {
//   const result = await newPassword({
//     password: "password",
//   }, "token
//   ");
//   expect(result).toEqual({ error: "Invalid token!" });
// });
