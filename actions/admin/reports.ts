"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getAdminReports = async () => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    const reports = await db.report.findMany({
      include: {
        reporter: { select: { name: true, email: true } },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        targetJob: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: reports };
  } catch (error) {
    console.error("GET_REPORTS_ERROR", error);
    return { error: "Failed to load reports" };
  }
};
