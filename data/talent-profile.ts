import { db } from "@/lib/db";

export const getTalentProfileByUserId = async (userId: string) => {
  try {
    const profile = await db.talentProfile.findUnique({
      where: { userId },
      include: {
        photos: true,
        videos: true,
        audioSamples: true,
        documents: true,
        experience: true,
      },
    });

    return profile;
  } catch {
    return null;
  }
};
