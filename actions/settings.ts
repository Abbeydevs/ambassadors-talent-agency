"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { auth } from "@/auth";
import { getUserByEmail, getUserById } from "@/data/user";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(session.user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (session.user.image && !dbUser.hashedPassword) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== session.user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== session.user.id) {
      return { error: "Email already in use!" };
    }

    // In a full app, you would send a verification token here before updating
    // For MVP, we might just update it or disable email changes
  }

  if (values.password && values.newPassword && dbUser.hashedPassword) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.hashedPassword
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  } else {
    values.password = undefined;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings Updated!" };
};
