import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSystemSettings } from "@/actions/admin/settings";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export default async function SettingsPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return redirect("/");
  }

  const result = await getSystemSettings();

  if (result.error || !result.success) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load settings. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <SettingsForm initialData={result.success} />
    </div>
  );
}
