"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getRecentActivity = async () => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const logs = await db.activityLog.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: {
          select: { name: true, image: true },
        },
        targetUser: {
          select: { name: true, email: true, companyName: true },
        },
      },
    });

    return { success: logs };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return { error: "Failed to fetch activity logs" };
  }
};
