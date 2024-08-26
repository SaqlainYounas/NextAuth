import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({message: "Please enter a valid email address."}),
  password: z.string().min(1, {message: "Password is required to login"}),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.string().email({message: "Please enter a valid email address."}),
  password: z
    .string()
    .min(6, {message: "Password minimum length is 6 characters"}),
});

export const ResetSchema = z.object({
  email: z.string().email({message: "Email is required to reset password"}),
});
export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, {message: "Password minimum length is 6 characters"}),
});
