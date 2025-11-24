"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const deleteAccount = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.user.delete({
      where: { id: session.user.id },
    });

    return { success: "Account deleted" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};
