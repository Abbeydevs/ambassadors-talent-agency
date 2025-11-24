import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { PublicProfileView } from "@/components/talent/public-profile-view";
import { redirect } from "next/navigation";

export default async function ProfilePreviewPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth/login");
  }

  const profile = await getTalentProfileByUserId(userId);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Profile not found. Please update your profile first.
        </p>
      </div>
    );
  }

  return <PublicProfileView profile={profile} isPreview={true} />;
}
