import { db } from "@/lib/db";

export const getJobById = async (jobId: string) => {
  try {
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        employer: {
          include: {
            user: true,
          },
        },
      },
    });

    return job;
  } catch {
    return null;
  }
};
