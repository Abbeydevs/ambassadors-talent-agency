"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { EventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const updateEvent = async (
  values: z.infer<typeof EventSchema>,
  eventId: string
) => {
  const validatedFields = EventSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    title,
    slug,
    description,
    location,
    coverImage,
    category,
    startDate,
    endDate,
    featured,
    isPublished,
  } = validatedFields.data;

  // Check unique slug (excluding self)
  const existingEvent = await db.event.findFirst({
    where: {
      slug,
      NOT: { id: eventId },
    },
  });

  if (existingEvent) {
    return { error: "Slug already exists!" };
  }

  try {
    await db.event.update({
      where: { id: eventId },
      data: {
        title,
        slug,
        description,
        location,
        coverImage,
        category,
        startDate,
        endDate,
        featured,
        isPublished,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath(`/events/${slug}`);

    return { success: "Event updated successfully!" };
  } catch (error) {
    console.error("Error updating event:", error);
    return { error: "Something went wrong!" };
  }
};
