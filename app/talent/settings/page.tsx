import { AccountSettingsForm } from "@/components/auth/account-settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your account credentials and security.
        </p>
      </div>
      <AccountSettingsForm />
    </div>
  );
}
