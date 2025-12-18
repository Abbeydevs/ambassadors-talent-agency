"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { sendJobInvitationEmail } from "@/lib/mail";

export const inviteTalentToJob = async (
  talentId: string,
  jobId: string,
  message: string
) => {
  try {
    const session = await auth();
    if (session?.user?.role !== "EMPLOYER" || !session?.user?.id)
      return { error: "Unauthorized" };

    const employer = await getEmployerProfileByUserId(session.user.id);
    const job = await db.job.findUnique({ where: { id: jobId } });

    const talent = await db.talentProfile.findUnique({
      where: { id: talentId },
      include: { user: true },
    });

    if (!employer || !job || !talent) return { error: "Data not found" };

    await sendJobInvitationEmail(
      talent.user.email!,
      talent.user.name!,
      employer.user.name!,
      job.title,
      `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}`
    );

    return { success: "Invitation sent successfully!" };
  } catch (error) {
    console.error("Error inviting talent to job:", error);
    return { error: "Failed to send invitation" };
  }
};
