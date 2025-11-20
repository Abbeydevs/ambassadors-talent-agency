import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  TALENT_LOGIN_REDIRECT,
  EMPLOYER_LOGIN_REDIRECT,
  ADMIN_LOGIN_REDIRECT,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isEmployerRoute = nextUrl.pathname.startsWith("/employer");
  const isTalentRoute = nextUrl.pathname.startsWith("/talent");

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === "ADMIN")
        return Response.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
      if (role === "EMPLOYER")
        return Response.redirect(new URL(EMPLOYER_LOGIN_REDIRECT, nextUrl));
      return Response.redirect(new URL(TALENT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isLoggedIn) {
    if (isAdminRoute && role !== "ADMIN") {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (isEmployerRoute && role !== "EMPLOYER") {
      return Response.redirect(new URL(TALENT_LOGIN_REDIRECT, nextUrl));
    }

    if (isTalentRoute && role !== "TALENT") {
      if (role === "EMPLOYER")
        return Response.redirect(new URL(EMPLOYER_LOGIN_REDIRECT, nextUrl));
      if (role === "ADMIN")
        return Response.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
