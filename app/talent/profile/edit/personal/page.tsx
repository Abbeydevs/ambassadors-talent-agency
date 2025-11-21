import { PersonalInfoForm } from "@/components/talent/personal-info-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { User, FileText, Shield } from "lucide-react";

export default async function SettingsProfilePage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-linear-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Personal Information
            </h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Update your personal details and information. This is how employers
            will identify and connect with you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-[#1E40AF]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Complete Profile
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Fill all fields to improve visibility
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Auto-Save Enabled
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Changes save automatically
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <User className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Profile Visibility
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Visible to all employers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <PersonalInfoForm initialData={profile} />
      </div>
    </div>
  );
}
