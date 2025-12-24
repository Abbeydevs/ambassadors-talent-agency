"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteEvent = async (eventId: string) => {
  try {
    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");

    return { success: "Event deleted successfully!" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { error: "Failed to delete event." };
  }
};
