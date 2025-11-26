"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { JobPostSchema } from "@/schemas";
import { getEmployerProfileByUserId } from "@/data/employer-profile";

export const updateJob = async (
  values: z.infer<typeof JobPostSchema>,
  jobId: string
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "EMPLOYER" || !userId) {
      return { error: "Unauthorized" };
    }

    const employerProfile = await getEmployerProfileByUserId(userId);

    if (!employerProfile) {
      return { error: "Profile not found" };
    }

    const existingJob = await db.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob || existingJob.employerId !== employerProfile.id) {
      return { error: "Unauthorized to edit this job" };
    }

    const validatedFields = JobPostSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const data = validatedFields.data;

    await db.job.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        positions: data.positions,

        roleDescription: data.roleDescription,
        skills: data.skills || [],
        minAge: data.minAge,
        maxAge: data.maxAge,
        gender: data.gender,
        ethnicity: data.ethnicity,

        location: data.location,
        projectType: data.projectType,
        duration: data.duration,
        startDate: data.startDate,

        isPaid: data.isPaid,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        currency: data.currency,
        deadline: data.deadline,
        auditionDetails: data.auditionDetails,

        attachments: data.attachments || [],
        isFeatured: data.isFeatured,
        status: data.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      },
    });

    return { success: "Job updated successfully!" };
  } catch (error) {
    console.error("JOB_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
