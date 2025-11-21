import { ExperienceForm } from "@/components/talent/experience-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Award, Calendar, Building2 } from "lucide-react";

export default async function ExperiencePage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  if (profile && profile.experience) {
    profile.experience.sort((a, b) => b.year - a.year);
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#10B981] via-[#059669] to-[#047857] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Experience & Credits
            </h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            List your past roles and projects. Showcase your professional
            journey and build credibility with employers.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Projects & Roles
              </h3>
              <p className="text-xs text-gray-600 mt-1">Past work experience</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Companies</h3>
              <p className="text-xs text-gray-600 mt-1">Production studios</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Calendar className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Timeline</h3>
              <p className="text-xs text-gray-600 mt-1">Most recent first</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <ExperienceForm initialData={profile} />
      </div>
    </div>
  );
}
