"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProfileSettingsSchema } from "@/schemas";

export const updateProfileSettings = async (
  values: z.infer<typeof ProfileSettingsSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = ProfileSettingsSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { profileVisibility, contactInfoVisibility } = validatedFields.data;

    await db.talentProfile.update({
      where: { userId: userId },
      data: {
        profileVisibility,
        contactInfoVisibility: contactInfoVisibility
          ? JSON.stringify(contactInfoVisibility)
          : undefined,
      },
    });

    return { success: "Settings updated successfully!" };
  } catch (error) {
    console.error("SETTINGS_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
