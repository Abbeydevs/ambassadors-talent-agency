"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PortfolioMediaSchema } from "@/schemas";
import { updateProfileCompletion } from "@/lib/profile-score";

export const updatePortfolioMedia = async (
  values: z.infer<typeof PortfolioMediaSchema>
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!session || session.user.role !== "TALENT" || !userId) {
      return { error: "Unauthorized" };
    }

    const validatedFields = PortfolioMediaSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const {
      photos,
      videos,
      audioSamples,
      resume,
      externalPortfolioLinks,
      socialMediaLinks,
    } = validatedFields.data;

    const profile = await db.talentProfile.findUnique({
      where: { userId },
    });

    if (!profile) return { error: "Profile not found" };

    await db.$transaction(async (tx) => {
      if (photos) {
        await tx.portfolioPhoto.deleteMany({
          where: { talentProfileId: profile.id },
        });
        if (photos.length > 0) {
          await tx.portfolioPhoto.createMany({
            data: photos.map((p) => ({
              talentProfileId: profile.id,
              url: p.url,
              publicId: p.publicId || "",
            })),
          });
        }
      }

      if (videos) {
        await tx.portfolioVideo.deleteMany({
          where: { talentProfileId: profile.id },
        });
        if (videos.length > 0) {
          await tx.portfolioVideo.createMany({
            data: videos.map((v) => ({
              talentProfileId: profile.id,
              url: v.url,
              publicId: v.publicId || "",
            })),
          });
        }
      }

      if (audioSamples) {
        await tx.portfolioAudio.deleteMany({
          where: { talentProfileId: profile.id },
        });
        if (audioSamples.length > 0) {
          await tx.portfolioAudio.createMany({
            data: audioSamples.map((a) => ({
              talentProfileId: profile.id,
              url: a.url,
              publicId: a.publicId || "",
            })),
          });
        }
      }

      if (resume) {
        await tx.portfolioDocument.deleteMany({
          where: { talentProfileId: profile.id },
        });
        if (resume.length > 0) {
          await tx.portfolioDocument.create({
            data: {
              talentProfileId: profile.id,
              url: resume,
              publicId: "",
              fileName: "Resume",
            },
          });
        }
      }

      await tx.talentProfile.update({
        where: { id: profile.id },
        data: {
          externalPortfolioLinks: externalPortfolioLinks,
          socialMediaLinks: socialMediaLinks
            ? JSON.stringify(socialMediaLinks)
            : undefined,
        },
      });
    });

    await updateProfileCompletion(userId);

    return { success: "Media updated successfully!" };
  } catch (error) {
    console.error("MEDIA_UPDATE_ERROR", error);
    return { error: "Something went wrong!" };
  }
};
