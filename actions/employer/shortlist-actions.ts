"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { revalidatePath } from "next/cache";

export const createShortlist = async (name: string) => {
  const session = await auth();
  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id)
    return { error: "Unauthorized" };

  const profile = await getEmployerProfileByUserId(session.user.id);
  if (!profile) return { error: "Profile not found" };

  try {
    const list = await db.shortlist.create({
      data: {
        name,
        employerId: profile.id,
      },
    });
    revalidatePath("/employer/search");
    return { success: "List created", list };
  } catch (error) {
    console.error("Error creating shortlist:", error);
    return { error: "Failed to create list" };
  }
};

// 2. Add Talent to a List
export const addToShortlist = async (shortlistId: string, talentId: string) => {
  const session = await auth();
  if (session?.user?.role !== "EMPLOYER") return { error: "Unauthorized" };

  try {
    await db.shortlistItem.create({
      data: {
        shortlistId,
        talentId,
      },
    });
    return { success: "Added to shortlist" };
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    return { error: "Talent is already in this list" };
  }
};

export const getEmployerShortlists = async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  const profile = await getEmployerProfileByUserId(session.user.id);
  if (!profile) return [];

  return await db.shortlist.findMany({
    where: { employerId: profile.id },
    orderBy: { createdAt: "desc" },
  });
};
