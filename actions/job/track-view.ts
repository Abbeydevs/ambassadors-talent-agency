"use server";

import { db } from "@/lib/db";

export const incrementJobView = async (jobId: string) => {
  try {
    await db.job.update({
      where: { id: jobId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error incrementing job view:", error);
    return { error: "Failed to track view" };
  }
};
