import { Separator } from "@/components/ui/separator";
import { ProfileSettingsForm } from "@/components/talent/profile-settings-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";

export default async function SettingsPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Visibility & Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control your privacy and manage how employers see you.
        </p>
      </div>
      <Separator />
      <ProfileSettingsForm initialData={profile} />
    </div>
  );
}
