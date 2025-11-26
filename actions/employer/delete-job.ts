"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { revalidatePath } from "next/cache";

export const deleteJob = async (jobId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "EMPLOYER" || !userId) {
      return { error: "Unauthorized" };
    }

    const employerProfile = await getEmployerProfileByUserId(userId);

    const job = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.employerId !== employerProfile?.id) {
      return { error: "Unauthorized" };
    }

    await db.job.delete({
      where: { id: jobId },
    });

    revalidatePath("/employer/jobs");
    return { success: "Job deleted successfully" };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { error: "Something went wrong" };
  }
};
