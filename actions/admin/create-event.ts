"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { EventSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createEvent = async (values: z.infer<typeof EventSchema>) => {
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

  const existingEvent = await db.event.findUnique({
    where: { slug },
  });

  if (existingEvent) {
    return { error: "Slug already exists!" };
  }

  try {
    await db.event.create({
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

    return { success: "Event created successfully!" };
  } catch (error) {
    console.error("Error creating event:", error);
    return { error: "Something went wrong!" };
  }
};
