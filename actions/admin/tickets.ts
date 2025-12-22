"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAdminTickets = async () => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    const tickets = await db.ticket.findMany({
      include: {
        user: {
          select: { name: true, email: true, image: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: tickets };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { error: "Failed to load tickets" };
  }
};

export const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus
) => {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    await db.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    revalidatePath("/admin/support");
    return { success: "Ticket updated" };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { error: "Failed to update ticket" };
  }
};
