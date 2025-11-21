import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ProfileSidebarNav } from "@/components/talent/profile-sidebar-nav";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Manage your talent profile and portfolio.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block bg-slate-50 min-h-screen">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Edit Profile</h2>
        <p className="text-muted-foreground">
          Manage your profile settings and set up your portfolio.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <ProfileSidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-3xl bg-white p-6 rounded-lg border shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
