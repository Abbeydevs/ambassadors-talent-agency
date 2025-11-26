import { db } from "@/lib/db";
import { JobStatus } from "@prisma/client";
import { stat } from "fs";

export const getJobsByEmployerId = async (
  employerId: string,
  query?: string,
  status?: JobStatus
) => {
  try {
    const jobs = await db.job.findMany({
      where: {
        employerId,
        title: query ? { contains: query, mode: "insensitive" } : undefined,
        status: status ? status : undefined,
      },
      orderBy: { createdAt: "desc" },
    });

    return jobs;
  } catch {
    return [];
  }
};
