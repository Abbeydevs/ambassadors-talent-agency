"use client";

import {
  TalentProfile,
  User,
  PortfolioPhoto,
  PortfolioVideo,
  ExperienceCredit,
} from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Link as LinkIcon,
  Grid,
  User as UserIcon,
  Briefcase,
  Play,
  CheckCircle2,
  Calendar,
  Share2,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Type definition for the full profile data
type FullProfile = TalentProfile & {
  user: User;
  photos: PortfolioPhoto[];
  videos: PortfolioVideo[];
  experience: ExperienceCredit[];
};

interface PublicProfileViewProps {
  profile: FullProfile;
  isPreview?: boolean; // If true, shows "Edit" instead of "Message"
}

export const PublicProfileView = ({
  profile,
  isPreview,
}: PublicProfileViewProps) => {
  // Calculate age if DOB exists
  const age = profile.dateOfBirth
    ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. HERO SECTION (Twitter/LinkedIn Style Header) */}
      <div className="relative">
        {/* Cover Photo - Gradient pattern since we don't have a custom cover upload yet */}
        <div className="h-48 md:h-64 w-full bg-linear-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-size-[20px_20px]"></div>
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
        </div>

        {/* Profile Header Content */}
        <div className="px-4 md:px-8 max-w-4xl mx-auto">
          <div className="relative -mt-20 mb-4 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full p-1.5 bg-white shadow-xl">
                <Avatar className="h-full w-full border-2 border-gray-100">
                  <AvatarImage
                    src={profile.user.image || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-100 text-2xl font-bold text-slate-400">
                    {profile.user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Verification Badge */}
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-4 border-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
              {isPreview ? (
                <Button
                  asChild
                  className="flex-1 md:flex-none bg-slate-100 text-slate-900 hover:bg-slate-200 font-semibold rounded-full"
                >
                  <Link href="/talent/profile/edit/personal">Edit Profile</Link>
                </Button>
              ) : (
                <>
                  <Button className="flex-1 md:flex-none bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-full font-semibold">
                    Hire Talent
                  </Button>
                  <Button variant="outline" className="rounded-full border-2">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5 text-slate-600" />
              </Button>
            </div>
          </div>

          {/* Name & Bio Section */}
          <div className="space-y-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                {profile.user.name}
                {profile.stageName && (
                  <span className="text-lg text-slate-500 font-normal">
                    ({profile.stageName})
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
                {profile.talentCategories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="rounded-full px-3 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bio */}
            <p className="text-slate-700 leading-relaxed max-w-2xl">
              {profile.bio || "No bio added yet."}
            </p>

            {/* Quick Stats/Info Row */}
            <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-slate-500 border-y py-4">
              {profile.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {profile.city}, {profile.country}
                </div>
              )}
              {age && (
                <div className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  {age} Years Old
                </div>
              )}
              {profile.yearsOfExperience !== null && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  {profile.yearsOfExperience} Years Exp.
                </div>
              )}
              {profile.externalPortfolioLinks?.length > 0 && (
                <a
                  href={profile.externalPortfolioLinks[0]}
                  target="_blank"
                  className="flex items-center gap-1.5 text-[#1E40AF] hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  Portfolio Link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENT TABS (Instagram Style) */}
      <div className="max-w-4xl mx-auto px-0 md:px-8">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0 space-x-8 overflow-x-auto hide-scrollbar px-4 md:px-0">
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1E40AF] data-[state=active]:shadow-none rounded-none px-0 pb-3 font-medium text-slate-500 data-[state=active]:text-slate-900"
            >
              <Grid className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1E40AF] data-[state=active]:shadow-none rounded-none px-0 pb-3 font-medium text-slate-500 data-[state=active]:text-slate-900"
            >
              <UserIcon className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#1E40AF] data-[state=active]:shadow-none rounded-none px-0 pb-3 font-medium text-slate-500 data-[state=active]:text-slate-900"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Experience
            </TabsTrigger>
          </TabsList>

          {/* PORTFOLIO TAB (Instagram Grid) */}
          <TabsContent value="portfolio" className="mt-6 px-1 md:px-0">
            {profile.photos.length === 0 && profile.videos.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Grid className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No posts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {/* Photos */}
                {profile.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square bg-slate-100 md:rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={photo.url}
                      alt="Portfolio"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
                {/* Videos (With Play Icon Overlay) */}
                {profile.videos.map((video) => (
                  <div
                    key={video.id}
                    className="relative aspect-square bg-slate-900 md:rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <video
                      src={video.url}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="mt-6 px-4 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Physical Stats Card */}
              <div className="border rounded-2xl p-6 shadow-sm bg-white">
                <h3 className="font-semibold text-lg mb-4">
                  Physical Attributes
                </h3>
                <div className="space-y-4">
                  <AttributeRow
                    label="Height"
                    value={profile.height ? `${profile.height}cm` : "-"}
                  />
                  <AttributeRow
                    label="Weight"
                    value={profile.weight ? `${profile.weight}kg` : "-"}
                  />
                  <AttributeRow
                    label="Body Type"
                    value={profile.bodyType || "-"}
                  />
                  <AttributeRow
                    label="Eye Color"
                    value={profile.eyeColor || "-"}
                  />
                  <AttributeRow
                    label="Hair Color"
                    value={profile.hairColor || "-"}
                  />
                  <AttributeRow
                    label="Ethnicity"
                    value={profile.ethnicity || "-"}
                  />
                </div>
              </div>

              {/* Skills & Languages */}
              <div className="border rounded-2xl p-6 shadow-sm bg-white">
                <h3 className="font-semibold text-lg mb-4">
                  Skills & Languages
                </h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-sm text-slate-500 block mb-2">
                      Languages
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.length > 0 ? (
                        profile.languages.map((l) => (
                          <Badge
                            key={l}
                            variant="outline"
                            className="rounded-md"
                          >
                            {l}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          None listed
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500 block mb-2">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((s) => (
                          <Badge
                            key={s}
                            variant="outline"
                            className="rounded-md"
                          >
                            {s}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          None listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* EXPERIENCE TAB (Timeline Style) */}
          <TabsContent value="experience" className="mt-6 px-4 md:px-0">
            <div className="border rounded-2xl p-6 shadow-sm bg-white max-w-3xl">
              <h3 className="font-semibold text-lg mb-6">Work History</h3>

              {profile.experience.length === 0 ? (
                <p className="text-slate-500 italic">No experience listed.</p>
              ) : (
                <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-slate-200">
                  {profile.experience
                    .sort((a, b) => b.year - a.year) // Sort by date
                    .map((exp) => (
                      <div key={exp.id} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#1E40AF] shadow-sm"></div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <h4 className="font-bold text-slate-900">
                            {exp.projectTitle}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="w-fit flex items-center gap-1"
                          >
                            <Calendar className="h-3 w-3" /> {exp.year}
                          </Badge>
                        </div>
                        <p className="text-[#1E40AF] font-medium text-sm">
                          {exp.role}
                        </p>
                        <p className="text-slate-500 text-sm mb-2">
                          {exp.productionCompany}
                        </p>
                        {exp.description && (
                          <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Simple helper for attributes
function AttributeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 last:border-0 pb-2 last:pb-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-900 font-medium text-sm">{value}</span>
    </div>
  );
}
