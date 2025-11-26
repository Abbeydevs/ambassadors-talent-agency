"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { revalidatePath } from "next/cache";

export const duplicateJob = async (jobId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "EMPLOYER" || !userId) {
      return { error: "Unauthorized" };
    }

    const employerProfile = await getEmployerProfileByUserId(userId);

    const existingJob = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob || existingJob.employerId !== employerProfile?.id) {
      return { error: "Unauthorized" };
    }

    await db.job.create({
      data: {
        employerId: existingJob.employerId,
        title: `${existingJob.title} (Copy)`,
        description: existingJob.description,
        category: existingJob.category,
        positions: existingJob.positions,
        roleDescription: existingJob.roleDescription,
        skills: existingJob.skills,
        minAge: existingJob.minAge,
        maxAge: existingJob.maxAge,
        gender: existingJob.gender,
        ethnicity: existingJob.ethnicity,
        location: existingJob.location,
        projectType: existingJob.projectType,
        duration: existingJob.duration,
        startDate: undefined,
        deadline: undefined,
        isPaid: existingJob.isPaid,
        salaryMin: existingJob.salaryMin,
        salaryMax: existingJob.salaryMax,
        currency: existingJob.currency,
        auditionDetails: existingJob.auditionDetails,
        attachments: existingJob.attachments,
        isFeatured: false,
        status: "DRAFT",
      },
    });

    revalidatePath("/employer/jobs");
    return { success: "Job duplicated as Draft" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
