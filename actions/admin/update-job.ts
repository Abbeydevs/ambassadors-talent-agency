"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateJobValues {
  jobId: string;
  title: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
}

export const adminUpdateJob = async (values: UpdateJobValues) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const { jobId, title, description, location, salaryMin, salaryMax } = values;

  try {
    await db.job.update({
      where: { id: jobId },
      data: {
        title,
        description,
        location,
        salaryMin,
        salaryMax,
      },
    });

    revalidatePath("/admin/jobs");
    return { success: "Job content updated successfully" };
  } catch (error) {
    console.error("Error updating job content:", error);
    return { error: "Failed to update job content" };
  }
};
