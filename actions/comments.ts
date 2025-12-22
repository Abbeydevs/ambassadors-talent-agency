"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { CommentSchema } from "@/schemas";

export const createComment = async (values: z.infer<typeof CommentSchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to comment." };
  }

  const validatedFields = CommentSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid comment." };
  }

  const { content, postId } = validatedFields.data;

  try {
    await db.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
    });

    revalidatePath(`/blog/[slug]`);
    return { success: "Comment posted!" };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { error: "Failed to post comment." };
  }
};

export const getComments = async (postId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { error: "Failed to load comments" };
  }
};
