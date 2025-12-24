import { db } from "@/lib/db";

export const getAllEvents = async () => {
  try {
    const events = await db.event.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        startDate: "asc",
      },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getEventBySlug = async (slug: string) => {
  try {
    const event = await db.event.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { rsvps: true },
        },
        rsvps: {
          select: { userId: true },
        },
      },
    });
    return event;
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error);
    return null;
  }
};
