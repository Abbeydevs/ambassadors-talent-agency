"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PersonalDetailsSchema } from "@/schemas";

export const updatePersonalDetails = async (
  values: z.infer<typeof PersonalDetailsSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = PersonalDetailsSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      name,
      image,
      stageName,
      dateOfBirth,
      gender,
      country,
      city,
      phone,
      bio,
    } = validatedFields.data;

    await db.user.update({
      where: { id: userId },
      data: {
        name,
        image,
      },
    });

    await db.talentProfile.upsert({
      where: { userId: userId },
      update: {
        stageName,
        dateOfBirth,
        gender,
        country,
        city,
        phone,
        bio,
        profileCompletion: calculateCompletion({ name, country, city, phone }),
      },
      create: {
        userId: userId,
        stageName,
        dateOfBirth,
        gender,
        country,
        city,
        phone,
        bio,
        profileCompletion: 20,
      },
    });

    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};

function calculateCompletion(
  data: Partial<z.infer<typeof PersonalDetailsSchema>>
) {
  let score = 0;
  if (data.name) score += 5;
  if (data.country) score += 5;
  if (data.city) score += 5;
  if (data.phone) score += 5;
  return score;
}
