"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { JobPostSchema } from "@/schemas";
import { getEmployerProfileByUserId } from "@/data/employer-profile";

export const createJob = async (values: z.infer<typeof JobPostSchema>) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "EMPLOYER" || !userId) {
      return { error: "Unauthorized" };
    }

    const employerProfile = await getEmployerProfileByUserId(userId);

    if (!employerProfile) {
      return { error: "Please complete your company profile first." };
    }

    const validatedFields = JobPostSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const data = validatedFields.data;

    await db.job.create({
      data: {
        employerId: employerProfile.id, // Link to Employer Profile
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

    return { success: "Job created successfully!" };
  } catch (error) {
    console.error("JOB_CREATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
