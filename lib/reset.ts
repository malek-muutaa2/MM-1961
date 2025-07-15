"use server";

import * as z from "zod";
import { v4 as uuidv4 } from "uuid";

import { ResetSchema } from "./zodschema";
import { findUniqueUser, UpdateUserToken } from "./user";
import { sendPasswordResetEmail } from "./mail";


export const reset = async (
  values: z.infer<typeof ResetSchema>,
 
) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Email non valid !" };
  }

  const { email } = validatedFields.data;

  const existingUser = await findUniqueUser(email);
    if (!existingUser[0]) {
    return { error: "The email does not exist in our records." };
  }
  if (existingUser[0]?.deleted_at !== null) {
    return { error: "The email is associated with a deleted account." };
  }

  if (existingUser[0]) {
    const passwordResetToken = await generatePasswordResetToken(email);
    if (passwordResetToken[0].resetpasswordtoken) {
      const res = await sendPasswordResetEmail(
        email,
        passwordResetToken[0].resetpasswordtoken,
        "en",
      );
      console.log("res", res);
    }

    return { success: "Password reset email sent successfully." };
  }
  }
 

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();

  const passwordResetToken = await UpdateUserToken(token, email);

  return passwordResetToken;
};
