"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import * as z from "zod";
import { TicketSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

export const createTicket = async (values: z.infer<typeof TicketSchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to submit a ticket" };
  }

  const validatedFields = TicketSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { subject, message, priority } = validatedFields.data;

  try {
    await db.ticket.create({
      data: {
        userId: session.user.id,
        subject,
        message,
        priority,
        status: "OPEN",
      },
    });

    return {
      success: "Ticket submitted successfully! We will contact you soon.",
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { error: "Failed to submit ticket" };
  }
};
