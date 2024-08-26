import NextAuth, {type DefaultSession} from "next-auth";
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {db} from "../lib/db";
import {getUserById} from "../data/user";
import {JWT} from "next-auth/jwt";
import {UserRole} from "@prisma/client";
import {getTwoFactorConfirmationByUserId} from "../data/twoFactorConfirmation";
/* Extending OOTB Modules to fix typescript issues - Start*/
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role: UserRole;
  }
}
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}
/* Extending OOTB Modules to fix typescript issues - End*/

export const {handlers, auth, signIn, signOut} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({user}) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({user, account}) {
      if (!user || !user.id) return false;
      //Allow signin if signin method is anything other then credentials
      if (account?.provider !== "credentials") return true;

      /* Prevent Signin without email verification */
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) return false;

        //DELETE two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: {id: twoFactorConfirmation.id},
        });
      }
      return true;
    },
    async session({token, session}) {
      //we take the role in the token and give the session the current user's role
      if (token.role && session.user) {
        session.user.role = token.role;
      }

      //we are just modifying the id of the session to token.sub
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({token}) {
      /* Here we are just using the getUserByID and getting its role from it and passing it to the token. */
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  ...authConfig,
});
