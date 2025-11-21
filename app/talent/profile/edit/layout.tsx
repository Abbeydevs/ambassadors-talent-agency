import { Metadata } from "next";
import { ProfileSidebarNav } from "@/components/talent/profile-sidebar-nav";
import { Edit3, Sparkles } from "lucide-react";

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
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-linear-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Manage your profile settings and set up your portfolio. Complete all
            sections to maximize your visibility to employers.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Sparkles className="h-5 w-5 text-[#F59E0B]" />
              <h3 className="font-semibold text-gray-900">Profile Sections</h3>
            </div>
            <ProfileSidebarNav />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
