"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PhysicalAttributesSchema } from "@/schemas";
import { updateProfileCompletion } from "@/lib/profile-score";

export const updatePhysicalAttributes = async (
  values: z.infer<typeof PhysicalAttributesSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = PhysicalAttributesSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      height,
      weight,
      bodyType,
      eyeColor,
      hairColor,
      ethnicity,
      languages,
    } = validatedFields.data;

    await db.talentProfile.upsert({
      where: { userId: userId },
      update: {
        height,
        weight,
        bodyType,
        eyeColor,
        hairColor,
        ethnicity,
        languages,
      },
      create: {
        userId: userId,
        height,
        weight,
        bodyType,
        eyeColor,
        hairColor,
        ethnicity,
        languages,
      },
    });

    await updateProfileCompletion(userId);

    return { success: "Physical attributes updated!" };
  } catch (error) {
    console.error("PHYSICAL_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
