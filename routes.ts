export const publicRoutes = ["/", "/auth/new-verification"];

export const publicRoutePrefixes = [
  "/",
  "/jobs",
  "/talents",
  "/events",
  "/success-stories",
  "/courses",
  "/about",
  "/contact",
  "/new-verification",
];

export const authRoutes = [
  "/auth/login",
  "/auth/register/talent",
  "/auth/register/employer",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const TALENT_LOGIN_REDIRECT = "/talent/dashboard";
export const EMPLOYER_LOGIN_REDIRECT = "/employer/dashboard";
export const ADMIN_LOGIN_REDIRECT = "/admin";
