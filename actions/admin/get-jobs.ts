"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getAdminJobs = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const jobs = await db.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        employer: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true,
                companyName: true,
              },
            },
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    return { success: jobs };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { error: "Failed to fetch jobs" };
  }
};
