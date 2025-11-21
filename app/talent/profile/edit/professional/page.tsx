import { Separator } from "@/components/ui/separator";
import { ProfessionalDetailsForm } from "@/components/talent/professional-details-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";

export default async function ProfessionalDetailsPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Professional Details</h3>
        <p className="text-sm text-muted-foreground">
          Highlight your expertise, skills, and professional status.
        </p>
      </div>
      <Separator />
      <ProfessionalDetailsForm initialData={profile} />
    </div>
  );
}
