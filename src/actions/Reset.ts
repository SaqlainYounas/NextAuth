"use server";
import * as z from "zod";
import {ResetSchema} from "../../schemas";
import {getUserByEmail} from "../../data/user";
import {sendPasswordResetEmail} from "../../lib/mail";
import {generatePasswordResetToken} from "../../lib/tokens";
export async function Reset(values: z.infer<typeof ResetSchema>) {
  /* Validate the Fields */
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return {error: "Invalid email"};
  /* Extract email from the data */
  const {email} = validatedFields.data;

  /* Check if the user exists - if it doesn't send and error back */
  const existingUser = await getUserByEmail(email);

  if (!existingUser) return {error: "Email not found"};

  /* Generate token and send email */
  const token = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(token.email, token.token);
  return {success: "Password reset email sent!"};
}
