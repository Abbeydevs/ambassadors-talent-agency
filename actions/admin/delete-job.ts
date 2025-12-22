"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteJob = async (jobId: string) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.job.delete({
      where: { id: jobId },
    });

    revalidatePath("/admin/jobs");
    return { success: "Job deleted successfully" };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { error: "Failed to delete job" };
  }
};
