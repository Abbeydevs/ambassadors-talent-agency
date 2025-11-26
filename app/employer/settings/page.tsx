import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { CompanyProfileForm } from "@/components/employer/company-profile-form";
import { redirect } from "next/navigation";
import { Building2, Globe, Users } from "lucide-react";

export default async function EmployerSettingsPage() {
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id) {
    return redirect("/");
  }

  const profile = await getEmployerProfileByUserId(session.user.id);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#059669] via-[#10B981] to-[#34D399] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Company Profile</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Manage your company details and branding. A complete profile helps
            attract the best talent.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Company Info
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Name, logo & description
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Globe className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Location</h3>
              <p className="text-xs text-gray-600 mt-1">Office address</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Company Size
              </h3>
              <p className="text-xs text-gray-600 mt-1">Team details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <CompanyProfileForm initialData={profile} />
      </div>
    </div>
  );
}
