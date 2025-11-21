import { Separator } from "@/components/ui/separator";
import { PersonalInfoForm } from "@/components/talent/personal-info-form";
import { auth } from "@/auth"; // Import auth
import { getTalentProfileByUserId } from "@/data/talent-profile"; // We made this helper earlier

export default async function SettingsProfilePage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          This is how employers will identify you.
        </p>
      </div>
      <Separator />
      <PersonalInfoForm initialData={profile} />
    </div>
  );
}
