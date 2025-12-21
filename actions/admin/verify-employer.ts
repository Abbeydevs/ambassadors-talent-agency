"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export const toggleEmployerVerification = async (
  userId: string,
  shouldVerify: boolean
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.employerProfile.update({
      where: { userId },
      data: { isVerified: shouldVerify },
    });

    await logActivity(
      userId,
      shouldVerify ? "VERIFIED_BUSINESS" : "UNVERIFIED_BUSINESS",
      "Admin toggled business verification"
    );

    revalidatePath("/admin/employers");
    return {
      success: `Employer ${
        shouldVerify ? "verified" : "unverified"
      } successfully.`,
    };
  } catch (error) {
    console.error("Error updating employer verification status:", error);
    return { error: "Failed to update status. Profile might not exist." };
  }
};
