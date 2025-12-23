"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SuccessStorySchema } from "@/schemas";
// import { auth } from "@/auth"; // Uncomment if you have auth set up to protect this route
import { revalidatePath } from "next/cache";

export const createSuccessStory = async (
  values: z.infer<typeof SuccessStorySchema>
) => {
  // 1. Validate fields
  const validatedFields = SuccessStorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    title,
    slug,
    excerpt,
    content,
    category,
    coverImage,
    talentId,
    featured,
    isPublished,
  } = validatedFields.data;

  const existingStory = await db.successStory.findUnique({
    where: { slug },
  });

  if (existingStory) {
    return {
      error: "This slug is already in use. Please change the URL slug.",
    };
  }

  try {
    await db.successStory.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        talentId,
        featured,
        isPublished,
      },
    });

    revalidatePath("/success-stories");
    revalidatePath("/admin/success-stories");

    return { success: "Success Story created!" };
  } catch (error) {
    console.error("Error creating story:", error);
    return { error: "Something went wrong!" };
  }
};
