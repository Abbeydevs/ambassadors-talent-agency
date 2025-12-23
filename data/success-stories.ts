import { db } from "@/lib/db";

export const getAllSuccessStories = async (category?: string) => {
  try {
    const stories = await db.successStory.findMany({
      where: {
        isPublished: true,
        ...(category && category !== "All" ? { category } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        talent: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return stories;
  } catch (error) {
    console.error("Error fetching all success stories:", error);
    return [];
  }
};

export const getSuccessStoryBySlug = async (slug: string) => {
  try {
    const story = await db.successStory.findUnique({
      where: {
        slug,
      },
      include: {
        talent: {
          select: {
            name: true,
            image: true,
            talentProfile: {
              select: {
                city: true,
                country: true,
              },
            },
          },
        },
      },
    });
    return story;
  } catch (error) {
    console.error("Error fetching story by slug:", error);
    return null;
  }
};

export const getRelatedStories = async (currentId: string) => {
  try {
    const stories = await db.successStory.findMany({
      where: {
        isPublished: true,
        id: { not: currentId },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    return stories;
  } catch (error) {
    console.error("Error fetching related stories:", error);
    return [];
  }
};

export const getFeaturedStory = async () => {
  try {
    const story = await db.successStory.findFirst({
      where: {
        featured: true,
        isPublished: true,
      },
      include: {
        talent: {
          select: { name: true, image: true },
        },
      },
    });
    return story;
  } catch (error) {
    console.error("Error fetching featured story:", error);
    return null;
  }
};

export const getAdminStories = async () => {
  try {
    const stories = await db.successStory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        talent: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return stories;
  } catch (error) {
    console.error("Error fetching admin stories:", error);
    return [];
  }
};

export const getSuccessStoryById = async (id: string) => {
  try {
    const story = await db.successStory.findUnique({
      where: { id },
    });
    return story;
  } catch (error) {
    console.error("Error fetching story by ID:", error);
    return null;
  }
};
