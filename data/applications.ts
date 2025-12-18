import { db } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";

export const getApplicationsByJobId = async (jobId: string) => {
  try {
    const applications = await db.application.findMany({
      where: { jobId },
      include: {
        talent: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return applications;
  } catch {
    return [];
  }
};

export const getAllApplicationsByEmployerId = async (
  employerId: string,
  status?: ApplicationStatus,
  search?: string
) => {
  try {
    const applications = await db.application.findMany({
      where: {
        job: {
          employerId: employerId,
        },
        status: status ? status : undefined,
        talent: search
          ? {
              user: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }
          : undefined,
      },
      include: {
        job: {
          select: { title: true },
        },
        talent: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return applications;
  } catch {
    return [];
  }
};
