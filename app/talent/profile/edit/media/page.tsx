import { Separator } from "@/components/ui/separator";
import { PortfolioMediaForm } from "@/components/talent/portfolio-media-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";

export default async function PortfolioMediaPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Portfolio & Media</h3>
        <p className="text-sm text-muted-foreground">
          Upload your best work to showcase your talent.
        </p>
      </div>
      <Separator />
      <PortfolioMediaForm initialData={profile} />
    </div>
  );
}
