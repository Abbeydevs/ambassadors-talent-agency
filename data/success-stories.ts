import { db } from "@/lib/db";

export const getAllSuccessStories = async (category?: string) => {
  try {
    const stories = await db.successStory.findMany({
      where: {
        ...(category && category !== "All" ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        talent: {
          select: { name: true, image: true },
        },
      },
    });
    return stories;
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return [];
  }
};

export const getSuccessStoryBySlug = async (slug: string) => {
  try {
    const story = await db.successStory.findUnique({
      where: { slug },
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
    console.error("Error fetching success story by slug:", error);
    return null;
  }
};

export const getRelatedStories = async (currentId: string) => {
  try {
    const stories = await db.successStory.findMany({
      where: {
        id: { not: currentId },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
    return stories;
  } catch (error) {
    console.error("Error fetching related success stories:", error);
    return [];
  }
};

export const getFeaturedStory = async () => {
  try {
    const story = await db.successStory.findFirst({
      where: { featured: true },
      include: {
        talent: {
          select: { name: true, image: true },
        },
      },
    });
    return story;
  } catch (error) {
    console.error("Error fetching featured success story:", error);
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
    console.error("Error fetching admin success stories:", error);
    return [];
  }
};
