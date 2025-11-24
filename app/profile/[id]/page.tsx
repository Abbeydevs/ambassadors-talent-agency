// app/profile/[id]/page.tsx

import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { PublicProfileView } from "@/components/talent/public-profile-view";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const session = await auth();
  const loggedInUserId = session?.user?.id;

  const { id } = await params;
  const profile = await getTalentProfileByUserId(id);

  if (!profile) {
    return notFound();
  }

  const isOwner = loggedInUserId === profile.userId;

  return <PublicProfileView profile={profile} isPreview={isOwner} />;
}
