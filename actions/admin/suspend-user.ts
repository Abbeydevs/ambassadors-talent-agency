"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export const toggleUserSuspension = async (
  userId: string,
  shouldSuspend: boolean
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { isSuspended: shouldSuspend },
    });

    await logActivity(
      userId,
      shouldSuspend ? "SUSPENDED_ACCOUNT" : "ACTIVATED_ACCOUNT",
      "Admin toggled account suspension"
    );

    revalidatePath("/admin/talents");
    revalidatePath("/admin/employers");

    return {
      success: `User account ${
        shouldSuspend ? "suspended" : "activated"
      } successfully.`,
    };
  } catch (error) {
    console.error("Error updating user suspension status:", error);
    return { error: "Failed to update suspension status." };
  }
};
