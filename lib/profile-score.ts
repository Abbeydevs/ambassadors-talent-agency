import { db } from "@/lib/db";

export const calculateProfileScore = async (userId: string) => {
  const profile = await db.talentProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      photos: true,
      videos: true,
      documents: true,
      experience: true,
    },
  });

  if (!profile) return 0;

  let score = 0;

  // --- 1. Personal Info (Max 25%) ---
  if (profile.user.image) score += 10;
  if (profile.bio && profile.bio.length > 10) score += 5;
  if (profile.city && profile.country) score += 5;
  if (profile.phone) score += 5;

  // --- 2. Professional Details (Max 25%) ---
  if (profile.talentCategories && profile.talentCategories.length > 0)
    score += 15;
  if (profile.skills && profile.skills.length > 0) score += 10;

  // --- 3. Media (Max 30%) ---
  if (profile.photos && profile.photos.length > 0) score += 15;
  const hasResume = profile.documents.some((d) => d.url);
  const hasVideo = profile.videos.length > 0;
  if (hasResume || hasVideo) score += 15;

  // --- 4. Experience (Max 10%) ---
  if (profile.experience && profile.experience.length > 0) score += 10;

  // --- 5. Physical Attributes (Max 10%) ---
  if (
    profile.height ||
    profile.weight ||
    profile.bodyType ||
    profile.eyeColor
  ) {
    score += 10;
  }

  return score;
};

export const updateProfileCompletion = async (userId: string) => {
  const score = await calculateProfileScore(userId);

  await db.talentProfile.update({
    where: { userId },
    data: {
      profileCompletion: score,
    },
  });

  return score;
};
