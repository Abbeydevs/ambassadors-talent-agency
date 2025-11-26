"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { revalidatePath } from "next/cache";

export const toggleSaveJob = async (jobId: string) => {
  try {
    const session = await auth();

    if (!session || session.user.role !== "TALENT" || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const profile = await getTalentProfileByUserId(session.user.id);

    if (!profile) {
      return { error: "Profile not found" };
    }

    // Check if already saved
    const existingSave = await db.savedJob.findUnique({
      where: {
        talentId_jobId: {
          talentId: profile.id,
          jobId: jobId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await db.savedJob.delete({
        where: { id: existingSave.id },
      });
      revalidatePath("/jobs");
      revalidatePath("/talent/saved-jobs");
      return { success: "Job removed from saved list", isSaved: false };
    } else {
      // Save
      await db.savedJob.create({
        data: {
          talentId: profile.id,
          jobId: jobId,
        },
      });
      revalidatePath("/jobs");
      revalidatePath("/talent/saved-jobs");
      return { success: "Job saved", isSaved: true };
    }
  } catch (error) {
    console.log("Error toggling save job:", error);
    return { error: "Something went wrong" };
  }
};
