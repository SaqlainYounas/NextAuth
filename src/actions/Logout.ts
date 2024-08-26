"use server";

import {signOut} from "@/auth";

export const logOut = async () => {
  //if we want to do some server side stuff before signing the user out, we can do that here.

  await signOut();
};
