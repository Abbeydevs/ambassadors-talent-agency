import { auth } from "@/auth";
import { db } from "@/lib/db";

export const logActivity = async (
  targetUserId: string,
  action: string,
  details?: string
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) return;

    await db.activityLog.create({
      data: {
        actorId: session.user.id,
        targetUserId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
};
