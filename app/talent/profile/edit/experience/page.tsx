import { Separator } from "@/components/ui/separator";
import { ExperienceForm } from "@/components/talent/experience-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";

export default async function ExperiencePage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  if (profile && profile.experience) {
    profile.experience.sort((a, b) => b.year - a.year);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Experience & Credits</h3>
        <p className="text-sm text-muted-foreground">
          List your past roles and projects. Most recent work appears first.
        </p>
      </div>
      <Separator />
      <ExperienceForm initialData={profile} />
    </div>
  );
}
