/* The Following routes are the ones which do not require authentication. They are accessible to the public. */
export const publicRoutes = ["/", "/auth/new-varification"];

/* The Following routes are the ones which will be used for authentication. These routes will redirect logged in users to /settings. */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",

  "/auth/new-password",
];

/* The prefix for api authentication routes, Routes that start with this prefix are used for API authentication purposes */
export const apiAuthPrefix = "/api/auth";

/* The Default Redirect path after logging in.  */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
