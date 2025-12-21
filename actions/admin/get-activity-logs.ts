"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getActivityLogs = async (userId: string) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const logs = await db.activityLog.findMany({
      where: {
        targetUserId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        actor: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { success: logs };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return { error: "Failed to fetch logs" };
  }
};
