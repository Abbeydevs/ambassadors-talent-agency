"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const getBlogPosts = async (term?: string, categorySlug?: string) => {
  try {
    const whereClause: Prisma.BlogPostWhereInput = {
      isPublished: true,
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(term && {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { excerpt: { contains: term, mode: "insensitive" } },
        ],
      }),
    };

    const posts = await db.blogPost.findMany({
      where: whereClause,
      include: {
        category: true,
        author: {
          select: { name: true, image: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: posts };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { error: "Failed to load blog posts" };
  }
};

export const getBlogPost = async (slug: string) => {
  try {
    const post = await db.blogPost.findUnique({
      where: {
        slug: slug,
        isPublished: true,
      },
      include: {
        category: true,
        author: {
          select: { name: true, image: true, role: true },
        },
      },
    });

    return { success: post };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { error: "Failed to load blog post" };
  }
};

export const getCategories = async () => {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: { name: "asc" },
    });
    return { success: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to load categories" };
  }
};
