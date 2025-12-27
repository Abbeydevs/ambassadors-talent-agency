import { db } from "@/lib/db";

export const getTalentDashboardStats = async (userId: string) => {
  try {
    const profile = await db.talentProfile.findUnique({
      where: { userId },
      select: { id: true, profileCompletion: true },
    });

    if (!profile) return null;

    const [
      applicationsCount,
      savedJobsCount,
      enrollmentsCount,
      recentApplications,
    ] = await Promise.all([
      db.application.count({
        where: { talentId: profile.id },
      }),

      db.savedJob.count({
        where: { talentId: profile.id },
      }),

      db.enrollment.count({
        where: { userId },
      }),

      db.application.findMany({
        where: { talentId: profile.id },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: {
              title: true,
              location: true,
              projectType: true,
              salaryMin: true,
              salaryMax: true,
              currency: true,
              isPaid: true,
              employer: {
                select: {
                  companyName: true,
                  companyLogoUrl: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      completionScore: profile.profileCompletion,
      applicationsCount,
      savedJobsCount,
      enrollmentsCount,
      recentApplications,
    };
  } catch (error) {
    console.error("Error fetching talent dashboard stats:", error);
    return null;
  }
};

export const getAllTalentApplications = async (userId: string) => {
  try {
    const profile = await db.talentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) return [];

    const applications = await db.application.findMany({
      where: { talentId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            projectType: true,
            deadline: true,
            employer: {
              select: {
                companyName: true,
                companyLogoUrl: true,
              },
            },
          },
        },
      },
    });

    return applications;
  } catch (error) {
    console.error("Error fetching all applications:", error);
    return [];
  }
};
