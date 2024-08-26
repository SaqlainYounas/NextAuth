"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import {RegisterSchema} from "../../schemas";
import {db} from "../../lib/db";
import {getUserByEmail} from "../../data/user";
import {generateVerificationToken} from "@/../lib/tokens";
import {sendVerificationEmail} from "../../lib/mail";
export async function Register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: "Invalid fields"};
  }

  const {name, email, password} = validatedFields.data;
  const hashedPasword = await bcrypt.hash(password, 10);

  //below code we will check if the user already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {error: "Email already in use"};
  }

  /* Create the user */
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPasword,
    },
  });

  /* Generate the verification token and send it in the email. */
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return {success: "Confirmation Email Sent"};
}
