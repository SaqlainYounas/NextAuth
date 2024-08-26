"use server";

import {db} from "../../lib/db";
import {getUserByEmail} from "../../data/user";
import {getVerificationTokenByToken} from "../../data/verificationToken";
/* The Following Function will just confirm whether the token being checked exists or it isn't expired. */
export const newVerification = async (token: string) => {
  /* Find the Token in the database. */
  const existingToken = await getVerificationTokenByToken(token);

  /* If we cannot find the token then we return the error */
  if (!existingToken) return {error: "Token does not exist!"};

  /* If an hour has passed since the token was generated then we return with an error that Token has expired. */
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {error: "Token has Expired"};
  }

  /* Otherwise we get the user who is trying to verify its token */
  const existingUser = await getUserByEmail(existingToken.email);

  /* Edge case - if the user doesn't exist throw an error */
  if (!existingUser) {
    return {error: "Email doesn't exist"};
  }

  /* IF all goes well then we will update the user - we find the user using its ID and update its emailVerified and update its email if the user wants to update their email */
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  /* We remove the old verification token from our database */
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  /* Return with success message because email is verified and delted from verification token database */
  return {success: "Email Verified"};
};
