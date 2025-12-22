"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const toggleJobFeature = async (jobId: string, isFeatured: boolean) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.job.update({
      where: { id: jobId },
      data: { isFeatured },
    });

    revalidatePath("/admin/jobs");
    return {
      success: isFeatured
        ? "Job marked as featured"
        : "Job removed from featured",
    };
  } catch (error) {
    console.error("Error updating job feature status:", error);
    return { error: "Failed to update feature status" };
  }
};
