"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getEmployerHiringHistory = async (userId: string) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const employerProfile = await db.employerProfile.findUnique({
      where: { userId },
    });

    if (!employerProfile) {
      return { error: "Employer profile not found" };
    }

    const jobs = await db.job.findMany({
      where: {
        employerId: employerProfile.id,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        applications: {
          where: {
            status: "HIRED",
          },
          include: {
            talent: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { success: jobs };
  } catch (error) {
    console.error("Error fetching hiring history:", error);
    return { error: "Failed to fetch hiring history" };
  }
};
