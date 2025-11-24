"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ExperienceListSchema } from "@/schemas";
import { updateProfileCompletion } from "@/lib/profile-score";

export const updateExperience = async (
  values: z.infer<typeof ExperienceListSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = ExperienceListSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { experience } = validatedFields.data;

    const profile = await db.talentProfile.findUnique({
      where: { userId },
    });

    if (!profile) return { error: "Profile not found" };

    await db.$transaction(async (tx) => {
      await tx.experienceCredit.deleteMany({
        where: { talentProfileId: profile.id },
      });

      if (experience.length > 0) {
        await tx.experienceCredit.createMany({
          data: experience.map((item) => ({
            talentProfileId: profile.id,
            projectTitle: item.projectTitle,
            role: item.role,
            year: item.year,
            productionCompany: item.productionCompany || "",
            description: item.description || "",
          })),
        });
      }
    });

    await updateProfileCompletion(userId);

    return { success: "Experience updated successfully!" };
  } catch (error) {
    console.error("EXPERIENCE_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
