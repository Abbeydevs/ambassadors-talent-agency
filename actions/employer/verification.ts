"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { revalidatePath } from "next/cache";

export const requestVerification = async (
  documentUrl: string,
  documentType: string
) => {
  const session = await auth();
  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id)
    return { error: "Unauthorized" };

  const profile = await getEmployerProfileByUserId(session.user.id);
  if (!profile) return { error: "Profile not found" };

  try {
    const existing = await db.verificationRequest.findFirst({
      where: {
        employerId: profile.id,
        status: "PENDING",
      },
    });

    if (existing) {
      return { error: "You already have a pending verification request." };
    }

    await db.verificationRequest.create({
      data: {
        employerId: profile.id,
        documentUrl,
        documentType,
        status: "PENDING",
      },
    });

    revalidatePath("/employer/settings");
    return { success: "Verification request submitted successfully!" };
  } catch (error) {
    console.error("Error submitting verification request:", error);
    return { error: "Failed to submit request" };
  }
};
