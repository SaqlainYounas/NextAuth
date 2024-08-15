"use server";
import * as z from "zod";
import {RegisterSchema} from "@/../schemas";

export async function Register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: "Invalid fields"};
  }

  return {success: "Registeration Success!"};
}
