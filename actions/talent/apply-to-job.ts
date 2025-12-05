"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ApplicationSchema } from "@/schemas";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { revalidatePath } from "next/cache";
import {
  sendApplicationConfirmationEmail,
  sendNewApplicationEmail,
} from "@/lib/mail";

export const applyToJob = async (
  values: z.infer<typeof ApplicationSchema>,
  jobId: string
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "You must be logged in as a Talent to apply." };
    }

    const profile = await getTalentProfileByUserId(userId);

    if (!profile) {
      return { error: "Please complete your profile before applying." };
    }

    const validatedFields = ApplicationSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
      include: { employer: { include: { user: true } } },
    });

    if (!job) return { error: "Job not found" };

    const existingApplication = await db.application.findUnique({
      where: {
        jobId_talentId: {
          jobId,
          talentId: profile.id,
        },
      },
    });

    if (existingApplication) {
      return { error: "You have already applied to this job." };
    }

    await db.application.create({
      data: {
        jobId,
        talentId: profile.id,
        coverLetter: validatedFields.data.coverLetter,
        attachments: validatedFields.data.attachments || [],
      },
    });

    sendNewApplicationEmail(
      job.employer.user.email,
      job.title,
      profile.user.name || "A Talent"
    );
    sendApplicationConfirmationEmail(profile.user.email, job.title);

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/talent/applications");

    return { success: "Application submitted successfully!" };
  } catch (error) {
    console.error("APPLICATION_ERROR", error);
    return { error: "Something went wrong." };
  }
};
