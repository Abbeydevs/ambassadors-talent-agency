"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import * as z from "zod";
import { ReportSchema } from "@/schemas";
import { ReportStatus } from "@prisma/client";

export const createReport = async (values: z.infer<typeof ReportSchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to report content." };
  }

  const validatedFields = ReportSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { reason, details, targetId, type } = validatedFields.data;

  try {
    if (type === "JOB") {
      await db.report.create({
        data: {
          reporterId: session.user.id,
          reason,
          details: details || "",
          status: ReportStatus.PENDING,
          targetJobId: targetId,
        },
      });
    } else {
      await db.report.create({
        data: {
          reporterId: session.user.id,
          reason,
          details: details || "",
          status: ReportStatus.PENDING,
          targetUserId: targetId,
        },
      });
    }

    return { success: "Report submitted. Our team will review it shortly." };
  } catch (error) {
    console.error("REPORT_ERROR", error);
    return { error: "Failed to submit report." };
  }
};
