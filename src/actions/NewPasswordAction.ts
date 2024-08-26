"use server";

import {db} from "../../lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";
import {NewPasswordSchema} from "../../schemas";
import {getUserByEmail} from "../../data/user";
import {getPassowordResetTokenByToken} from "@/../data/passwordResetToken";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string,
) => {
  /* Check if the token is passed throw an error otherwise */
  if (!token) return {error: "Missing token!"};
  /* Validate fields */
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: "Something went wrong"};
  }

  /* Extract validated password */
  const {password} = validatedFields.data;

  /* Get existing password token. */
  const existingToken = await getPassowordResetTokenByToken(token);

  if (!existingToken) return {error: "Invalid Token!"};
  /* Check if it has expired */
  const hasExipred = new Date(existingToken.expires) < new Date();

  if (hasExipred) return {error: "Token has Expired"};

  /* get the user who is trying to reset their password */
  const existingUser = await getUserByEmail(existingToken.email);

  /* edge case - return error if user doesn't exist */
  if (!existingUser) return {error: "Email does not exist"};

  /* finally hash the password and assigned to the relevent user */
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  /* clear the reset token */
  await db.passwordResetToken.delete({
    where: {id: existingToken.id},
  });

  return {success: "Password reset successfull!"};
};
