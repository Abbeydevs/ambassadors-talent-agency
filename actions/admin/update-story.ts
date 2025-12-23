"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { SuccessStorySchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const updateSuccessStory = async (
  values: z.infer<typeof SuccessStorySchema>,
  storyId: string
) => {
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

  const existingStory = await db.successStory.findFirst({
    where: {
      slug,
      NOT: {
        id: storyId,
      },
    },
  });

  if (existingStory) {
    return { error: "This slug is already in use by another story." };
  }

  try {
    await db.successStory.update({
      where: { id: storyId },
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
    revalidatePath(`/success-stories/${slug}`);

    return { success: "Success Story updated!" };
  } catch (error) {
    console.error("Error updating story:", error);
    return { error: "Something went wrong!" };
  }
};
