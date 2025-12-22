"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { AnnouncementSchema } from "@/schemas";

export const createAnnouncement = async (
  values: z.infer<typeof AnnouncementSchema>
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const validatedFields = AnnouncementSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { title, message, audience, sendAsEmail } = validatedFields.data;

  try {
    await db.announcement.create({
      data: {
        title,
        message,
        audience,
        sendAsEmail,
        creatorId: session.user.id!,
      },
    });

    let whereClause = {};
    if (audience === "TALENT") whereClause = { role: "TALENT" };
    if (audience === "EMPLOYER") whereClause = { role: "EMPLOYER" };

    const users = await db.user.findMany({
      where: whereClause,
      select: { id: true },
    });

    if (users.length > 0) {
      const notificationsData = users.map((user) => ({
        userId: user.id,
        title: title,
        message: message,
        type: "SYSTEM" as const,
      }));

      await db.notification.createMany({
        data: notificationsData,
      });
    }

    if (sendAsEmail) {
      console.log(
        `[EMAIL QUEUE] Sending email to ${users.length} users: ${title}`
      );
    }

    revalidatePath("/admin/communications");
    return { success: `Announcement sent to ${users.length} users!` };
  } catch (error) {
    console.error("ANNOUNCEMENT_ERROR", error);
    return { error: "Failed to send announcement." };
  }
};

export const getAnnouncementHistory = async () => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    const history = await db.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return { success: history };
  } catch (error) {
    console.error("ANNOUNCEMENT_HISTORY_ERROR", error);
    return { error: "Failed to load history" };
  }
};
