"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export const toggleTalentVerification = async (
  userId: string,
  shouldVerify: boolean
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.talentProfile.update({
      where: { userId },
      data: { isVerified: shouldVerify },
    });

    await logActivity(
      userId,
      shouldVerify ? "VERIFIED_PROFILE" : "UNVERIFIED_PROFILE",
      "Admin toggled talent verification"
    );

    revalidatePath("/admin/talents");
    return {
      success: `Talent ${
        shouldVerify ? "verified" : "unverified"
      } successfully.`,
    };
  } catch (error) {
    console.error("Error updating talent verification status:", error);
    return {
      error: "Failed to update status. Talent profile might not exist.",
    };
  }
};
