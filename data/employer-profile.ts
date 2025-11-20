import { db } from "@/lib/db";

export const getEmployerProfileByUserId = async (userId: string) => {
  try {
    const profile = await db.employerProfile.findUnique({
      where: { userId },
    });

    return profile;
  } catch {
    return null;
  }
};
