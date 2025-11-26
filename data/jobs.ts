import { db } from "@/lib/db";

export const getJobsByEmployerId = async (employerId: string) => {
  try {
    const jobs = await db.job.findMany({
      where: { employerId },
      orderBy: { createdAt: "desc" },
    });

    return jobs;
  } catch {
    return [];
  }
};
