import { PhysicalAttributesForm } from "@/components/talent/physical-attributes-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Ruler, Users, Globe } from "lucide-react";

export default async function PhysicalAttributesPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-linear-to-br from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Ruler className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Physical Attributes
            </h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Specific details often required for casting roles. This information
            helps employers find the perfect match for their projects.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Ruler className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Physical Details
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Height, weight, body type
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Appearance
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Eye & hair color, ethnicity
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Languages</h3>
              <p className="text-xs text-gray-600 mt-1">Spoken languages</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <PhysicalAttributesForm initialData={profile} />
      </div>
    </div>
  );
}
