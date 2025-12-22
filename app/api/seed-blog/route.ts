import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const author = await db.user.findFirst();

    if (!author) {
      return NextResponse.json(
        { error: "No users found. Please create a user first." },
        { status: 400 }
      );
    }

    const categories = [
      {
        name: "Audition Tips",
        slug: "audition-tips",
        description: "Guides to nailing your next casting.",
      },
      {
        name: "Industry News",
        slug: "industry-news",
        description: "Latest updates from Hollywood and beyond.",
      },
      {
        name: "Acting 101",
        slug: "acting-101",
        description: "Beginner resources for aspiring talents.",
      },
    ];

    for (const cat of categories) {
      await db.blogCategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    const posts = [
      {
        title: "How to Ace Your First Audition",
        slug: "how-to-ace-first-audition",
        excerpt:
          "Nervous about your big break? Here are 5 tips to calm your nerves and impress the casting director.",
        content:
          "<p>Auditions can be scary...</p><h2>1. Be Prepared</h2><p>Memorize your lines...</p>",
        categorySlug: "audition-tips",
        coverImage:
          "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&auto=format&fit=crop&q=60",
      },
      {
        title: "The Ultimate Guide to Headshots",
        slug: "ultimate-guide-headshots",
        excerpt:
          "Your face is your brand. Learn what makes a headshot stand out in a pile of resumes.",
        content: "<p>A good headshot is worth a thousand words...</p>",
        categorySlug: "acting-101",
        coverImage:
          "https://images.unsplash.com/photo-1533227297464-60f95652cd7d?w=800&auto=format&fit=crop&q=60",
      },
      {
        title: "Casting Directors: What They Really Want",
        slug: "casting-directors-what-they-want",
        excerpt:
          "We interviewed top casting directors to find out exactly what they look for in new talent.",
        content: "<p>It is not just about looks...</p>",
        categorySlug: "industry-news",
        coverImage:
          "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=60",
      },
      {
        title: "5 Red Flags in Casting Calls",
        slug: "5-red-flags-casting",
        excerpt:
          "Protect yourself from scams. If you see these signs, run the other way.",
        content: "<p>Safety first...</p>",
        categorySlug: "industry-news",
        coverImage:
          "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&auto=format&fit=crop&q=60",
      },
    ];

    for (const post of posts) {
      const category = await db.blogCategory.findUnique({
        where: { slug: post.categorySlug },
      });

      await db.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          isPublished: true,
          publishedAt: new Date(),
          authorId: author.id,
          categoryId: category?.id,
        },
      });
    }

    return NextResponse.json({ success: "Dummy data created successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
