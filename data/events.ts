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
