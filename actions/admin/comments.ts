"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteComment = async (commentId: string) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await db.comment.delete({
      where: { id: commentId },
    });

    revalidatePath("/admin/comments");
    revalidatePath("/blog");
    return { success: "Comment deleted" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
};
