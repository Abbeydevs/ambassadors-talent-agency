"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { JobStatus } from "@prisma/client";

export const moderateJob = async (jobId: string, status: JobStatus) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.job.update({
      where: { id: jobId },
      data: { status },
    });

    revalidatePath("/admin/jobs");

    const message =
      status === "PUBLISHED"
        ? "Job approved and is now live."
        : "Job flagged and removed from public view.";

    return { success: message };
  } catch (error) {
    console.error("Error updating job status:", error);
    return { error: "Failed to update job status" };
  }
};
