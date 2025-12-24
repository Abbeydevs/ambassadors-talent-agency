"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const registerForEvent = async (eventId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to RSVP." };
  }

  try {
    const existingRSVP = await db.eventRSVP.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
    });

    if (existingRSVP) {
      return { error: "You have already registered for this event." };
    }

    await db.eventRSVP.create({
      data: {
        eventId,
        userId: session.user.id,
      },
    });

    revalidatePath(`/events`);
    revalidatePath(`/events/[slug]`);

    return { success: "You are successfully registered!" };
  } catch (error) {
    console.error("Error registering for event:", error);
    return { error: "Something went wrong." };
  }
};
