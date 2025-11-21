import { ProfessionalDetailsForm } from "@/components/talent/professional-details-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Briefcase, Award, Target } from "lucide-react";

export default async function ProfessionalDetailsPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#F59E0B] via-[#F97316] to-[#FB923C] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Professional Details
            </h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Highlight your expertise, skills, and professional status. Showcase
            what makes you stand out in your field.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Expertise</h3>
              <p className="text-xs text-gray-600 mt-1">
                Categories & experience
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Award className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Skills & Talents
              </h3>
              <p className="text-xs text-gray-600 mt-1">Special abilities</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Target className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Availability
              </h3>
              <p className="text-xs text-gray-600 mt-1">Status & preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <ProfessionalDetailsForm initialData={profile} />
      </div>
    </div>
  );
}
