"use server";
import * as z from "zod";
import {db} from "@/../lib/db";
import {LoginSchema} from "../../schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "../../lib/tokens";
import {getUserByEmail} from "../../data/user";
import {sendVerificationEmail, sendTwoFactorEmail} from "../../lib/mail";
import {getTwoFactorTokenByEmail} from "../../data/twoFactorToken";
import {getTwoFactorConfirmationByUserId} from "../../data/twoFactorConfirmation";
export async function Login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: "Invalid fields"};
  }

  const {email, password, code} = validatedFields.data;

  /*----------- START - Check user verification token ----------------*/
  /* Below code checks if the user has their email verified, if not -then a new verification token is generated for them and sent to their email*/
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {error: "Email does not exist"};
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return {success: "Confirmation Email sent"};
  }
  /* END - Check user verification token */

  /-------------START - Check user Two Factor Authenticaiton ---------------- */;
  /* Below code checks if the user has turned on 2Factor authentication, if yes then normal signin will break and user will be asked to input the 2fA sent to their email*/
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {error: "Invalid Code"};
      }

      if (twoFactorToken.token !== code) {
        return {error: "Invalid Code"};
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return {
          error: "Token has expired, please login again to generate a new one",
        };
      }
      await db.twoFactorToken.delete({
        where: {
          token: twoFactorToken.token,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      //the below retur will break the normal login process and notify frontend that it needs to change its view as the user will now input the token
      return {twoFactor: true};
    }
  }
  /* END - Check user Two Factor Authentication */

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {error: "Invalid Credentials"};
        default:
          return {error: "Something went wrong while signing you in!"};
      }
    }
    throw error;
  }
}
