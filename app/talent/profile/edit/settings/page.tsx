import { ProfileSettingsForm } from "@/components/talent/profile-settings-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Settings, Shield, Eye } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Control your privacy and manage how employers see you. Customize
            your visibility and contact preferences.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Eye className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Visibility
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Public or private profile
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Privacy</h3>
              <p className="text-xs text-gray-600 mt-1">
                Contact info settings
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <Settings className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Preferences
              </h3>
              <p className="text-xs text-gray-600 mt-1">Manage your settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <ProfileSettingsForm initialData={profile} />
      </div>
    </div>
  );
}
