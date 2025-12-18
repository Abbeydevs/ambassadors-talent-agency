"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getEmployerProfileByUserId } from "@/data/employer-profile";

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  jobId: string
) => {
  try {
    const session = await auth();
    if (session?.user?.role !== "EMPLOYER" || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const profile = await getEmployerProfileByUserId(session.user.id);
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || application.job.employerId !== profile?.id) {
      return { error: "Unauthorized" };
    }

    await db.application.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath(`/employer/jobs/${jobId}/applications`);
    return { success: `Status updated to ${status}` };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};

export const saveApplicationNote = async (
  applicationId: string,
  note: string,
  jobId: string
) => {
  try {
    const session = await auth();
    if (session?.user?.role !== "EMPLOYER" || !session.user.id) {
      return { error: "Unauthorized" };
    }

    const profile = await getEmployerProfileByUserId(session.user.id);
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application || application.job.employerId !== profile?.id) {
      return { error: "Unauthorized" };
    }

    await db.application.update({
      where: { id: applicationId },
      data: { notes: note },
    });

    revalidatePath(`/employer/jobs/${jobId}/applications`);
    return { success: "Note saved" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
