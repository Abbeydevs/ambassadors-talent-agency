"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProfessionalDetailsSchema } from "@/schemas";
import { updateProfileCompletion } from "@/lib/profile-score";

export const updateProfessionalDetails = async (
  values: z.infer<typeof ProfessionalDetailsSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = ProfessionalDetailsSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      talentCategories,
      yearsOfExperience,
      skills,
      unionMemberships,
      availabilityStatus,
      willingToTravel,
    } = validatedFields.data;

    await db.talentProfile.upsert({
      where: { userId: userId },
      update: {
        talentCategories,
        yearsOfExperience,
        skills,
        unionMemberships,
        availabilityStatus,
        willingToTravel,
      },
      create: {
        userId: userId,
        talentCategories,
        yearsOfExperience,
        skills,
        unionMemberships,
        availabilityStatus,
        willingToTravel,
        profileCompletion: 20,
      },
    });

    await updateProfileCompletion(userId);

    return { success: "Professional details updated!" };
  } catch (error) {
    console.error("PROFESSIONAL_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
