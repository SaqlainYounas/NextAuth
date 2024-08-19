"use server";
import * as z from "zod";
import bcrypt from "bcrypt";
import {RegisterSchema} from "@/schemas";
import {db} from "@/lib/db";
import {getUserByEmail} from "../data/user";
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

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPasword,
    },
  });

  //TODO: Add email verification
  return {success: "User Created!"};
}
