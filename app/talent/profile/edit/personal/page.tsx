import { Separator } from "@/components/ui/separator";
import { PersonalInfoForm } from "@/components/talent/personal-info-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          This is how employers will identify you. Basic contact info is private
          until you apply.
        </p>
      </div>
      <Separator />
      <PersonalInfoForm />
    </div>
  );
}
