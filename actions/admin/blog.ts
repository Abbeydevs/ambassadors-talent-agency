"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BlogPostSchema, CategorySchema } from "@/schemas";
import * as z from "zod";
import { revalidatePath } from "next/cache";

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export const createCategory = async (
  values: z.infer<typeof CategorySchema>
) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const validated = CategorySchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const { name, description } = validated.data;
  const slug = generateSlug(name);

  try {
    const category = await db.blogCategory.create({
      data: {
        name,
        slug,
        description,
      },
    });
    return { success: "Category created!", category };
  } catch (error) {
    console.error(error);
    return { error: "Category name already exists" };
  }
};

export const upsertBlogPost = async (
  values: z.infer<typeof BlogPostSchema>,
  postId?: string
) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const validated = BlogPostSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const {
    title,
    content,
    excerpt,
    coverImage,
    categoryId,
    isPublished,
    metaTitle,
    metaDescription,
  } = validated.data;

  const slug = generateSlug(title);

  try {
    if (postId) {
      await db.blogPost.update({
        where: { id: postId },
        data: {
          title,
          content,
          excerpt,
          coverImage,
          categoryId,
          isPublished,
          metaTitle,
          metaDescription,
          slug,
        },
      });
      revalidatePath(`/blog/${slug}`);
    } else {
      const existingSlug = await db.blogPost.findUnique({ where: { slug } });
      if (existingSlug) {
        return { error: "A post with this title already exists." };
      }

      await db.blogPost.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage,
          categoryId,
          isPublished,
          metaTitle,
          metaDescription,
          authorId: session.user.id!,
          publishedAt: isPublished ? new Date() : null,
        },
      });
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: postId ? "Post updated!" : "Post created!" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};

export const deleteBlogPost = async (postId: string) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    await db.blogPost.delete({
      where: { id: postId },
    });
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: "Post deleted" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete post" };
  }
};
