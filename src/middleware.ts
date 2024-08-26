import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
const {auth} = NextAuth(authConfig);

export default auth((req) => {
  const {nextUrl: NextUrl} = req;
  const isLoggedIn = !!req.auth; // This line will tell us if we authenticated or not.

  const isApiAuthRoute = NextUrl.pathname.includes(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(NextUrl.pathname);
  const isAuthRoute = authRoutes.includes(NextUrl.pathname);

  //agar ham ye wala route access kr rhy hain tou allowed hai always
  if (isApiAuthRoute) {
    return;
  }

  //agar ham auth route ko access kr rhy hain, aur ham already loggedin hain tou default route pr jayen
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, NextUrl));
    }
    return;
  }

  //agar ham login bhi nai hen, aur public route bhi nai hy, then login krna hai
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", NextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
