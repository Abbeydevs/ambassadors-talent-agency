import { Separator } from "@/components/ui/separator";
import { PhysicalAttributesForm } from "@/components/talent/physical-attributes-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";

export default async function PhysicalAttributesPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Physical Attributes</h3>
        <p className="text-sm text-muted-foreground">
          Specific details often required for casting roles.
        </p>
      </div>
      <Separator />
      <PhysicalAttributesForm initialData={profile} />
    </div>
  );
}
