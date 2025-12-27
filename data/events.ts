import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface EventFilterParams {
  query?: string;
  category?: string;
  location?: string;
  startDate?: Date;
}

export const getAllEvents = async (params: EventFilterParams = {}) => {
  const { query, category, location, startDate } = params;

  const where: Prisma.EventWhereInput = {
    isPublished: true,
    AND: [
      query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { location: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      category ? { category: { equals: category, mode: "insensitive" } } : {},
      location ? { location: { contains: location, mode: "insensitive" } } : {},
      startDate ? { startDate: { gte: startDate } } : {},
    ],
  };

  try {
    const events = await db.event.findMany({
      where,
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

export const getAdminEvents = async () => {
  try {
    const events = await db.event.findMany({
      orderBy: {
        startDate: "desc",
      },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });
    return events;
  } catch (error) {
    console.error("Error fetching admin events:", error);
    return [];
  }
};

export const getEventGuests = async (eventId: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        rsvps: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return event;
  } catch (error) {
    console.error(`Error fetching guests for event with ID ${eventId}:`, error);
    return null;
  }
};
