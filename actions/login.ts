"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import {
  DEFAULT_LOGIN_REDIRECT,
  TALENT_LOGIN_REDIRECT,
  EMPLOYER_LOGIN_REDIRECT,
  ADMIN_LOGIN_REDIRECT,
} from "@/routes";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  let redirectUrl = DEFAULT_LOGIN_REDIRECT;

  if (existingUser && existingUser.role) {
    switch (existingUser.role) {
      case "EMPLOYER":
        redirectUrl = EMPLOYER_LOGIN_REDIRECT;
        break;
      case "TALENT":
        redirectUrl = TALENT_LOGIN_REDIRECT;
        break;
      case "ADMIN":
        redirectUrl = ADMIN_LOGIN_REDIRECT;
        break;
      default:
        redirectUrl = DEFAULT_LOGIN_REDIRECT;
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
