"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { revalidatePath } from "next/cache";

export const toggleSaveTalent = async (talentId: string) => {
  try {
    const session = await auth();
    if (session?.user?.role !== "EMPLOYER" || !session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const profile = await getEmployerProfileByUserId(session.user.id);
    if (!profile) return { error: "Profile not found" };

    const existing = await db.savedTalent.findUnique({
      where: {
        employerId_talentId: {
          employerId: profile.id,
          talentId: talentId,
        },
      },
    });

    if (existing) {
      await db.savedTalent.delete({
        where: { id: existing.id },
      });
      revalidatePath("/employer/search");
      return { success: "Removed from favorites", isSaved: false };
    } else {
      await db.savedTalent.create({
        data: {
          employerId: profile.id,
          talentId: talentId,
        },
      });
      revalidatePath("/employer/search");
      return { success: "Added to favorites", isSaved: true };
    }
  } catch (error) {
    console.error("Error in toggleSaveTalent:", error);
    return { error: "Something went wrong" };
  }
};
