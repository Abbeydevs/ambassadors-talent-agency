/* eslint-disable jsx-a11y/alt-text */
import { PortfolioMediaForm } from "@/components/talent/portfolio-media-form";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Image, Video, Music, FileText } from "lucide-react";

export default async function PortfolioMediaPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#EC4899] via-[#F472B6] to-[#FBCFE8] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Image className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Portfolio & Media</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Upload your best work to showcase your talent. High-quality media
            helps you stand out to employers.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-50 rounded-lg">
              <Image className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Photos</h3>
              <p className="text-xs text-gray-600 mt-1">Headshots & images</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Videos</h3>
              <p className="text-xs text-gray-600 mt-1">Showreels & demos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Music className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Audio</h3>
              <p className="text-xs text-gray-600 mt-1">Voice & music</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Documents</h3>
              <p className="text-xs text-gray-600 mt-1">Resume & CV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <PortfolioMediaForm initialData={profile} />
      </div>
    </div>
  );
}
