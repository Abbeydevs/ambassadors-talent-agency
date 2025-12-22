"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { SystemSettingsSchema } from "@/schemas";

export const getSystemSettings = async () => {
  try {
    let settings = await db.systemSettings.findUnique({
      where: { id: "default_settings" },
    });

    if (!settings) {
      settings = await db.systemSettings.create({
        data: {
          id: "default_settings",
          siteName: "Ambassador Talent Agency",
          supportEmail: "support@ambassador.com",
          emailTemplates: {
            welcome: { subject: "Welcome!", body: "Thanks for joining us." },
            application_received: {
              subject: "Application Received",
              body: "We received your application.",
            },
            hired: {
              subject: "You're Hired!",
              body: "Congratulations on the new job.",
            },
          },
        },
      });
    }

    return { success: settings };
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return { error: "Failed to load settings" };
  }
};

export const updateSystemSettings = async (
  values: z.infer<typeof SystemSettingsSchema>
) => {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const validatedFields = SystemSettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const data = validatedFields.data;

  try {
    await db.systemSettings.update({
      where: { id: "default_settings" },
      data: {
        ...data,
      },
    });

    revalidatePath("/admin/settings");
    return { success: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating system settings:", error);
    return { error: "Failed to update settings" };
  }
};
