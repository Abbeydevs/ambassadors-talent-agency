"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteSuccessStory = async (storyId: string) => {
  try {
    await db.successStory.delete({
      where: {
        id: storyId,
      },
    });

    revalidatePath("/success-stories");
    revalidatePath("/admin/success-stories");

    return { success: "Story deleted successfully!" };
  } catch (error) {
    console.error("Error deleting story:", error);
    return { error: "Failed to delete story." };
  }
};
