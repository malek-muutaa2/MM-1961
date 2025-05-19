import * as z from "zod";

export const ResetSchema = z.object({
  email: z.string().email({
    message: "L'email est requis",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Un minimum de 6 caractères est requis",
  }),
});

export const TwoFASchema = z.object({
  code: z.string().min(6, {
    message: "Le code est requis",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "L'email est requis",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe est requis",
  }),
  code: z.string().optional(),
});

export const LoginSchemaEn = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.string().optional(),
});
