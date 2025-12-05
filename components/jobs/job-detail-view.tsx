/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Job, EmployerProfile, User, TalentProfile } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  Share2,
  Bookmark,
  Building2,
  Globe,
  Linkedin,
  Check,
  Copy,
  Twitter,
  Facebook,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ApplyModal } from "./apply-modal";
import Link from "next/link";

type FullJob = Job & {
  employer: EmployerProfile & {
    user: User;
  };
};

type FullProfile = TalentProfile & { user: User };

interface JobDetailViewProps {
  job: FullJob;
  isTalent?: boolean;
  talentProfile?: FullProfile | null;
  hasApplied?: boolean;
}

export const JobDetailView = ({
  job,
  isTalent,
  talentProfile,
  hasApplied = false,
}: JobDetailViewProps) => {
  const [copied, setCopied] = useState(false);
  const jobUrl = `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}`;

  const onCopy = () => {
    navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const onShare = (platform: "twitter" | "linkedin" | "facebook") => {
    let url = "";
    const text = `Check out this job: ${job.title} at ${job.employer.user.companyName}`;

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          jobUrl
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          jobUrl
        )}`;
        break;
    }

    window.open(url, "_blank");
  };

  return (
    <div>
      <div className="bg-linear-to-br from-white to-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-5">
              {/* Company Logo */}
              <div className="h-20 w-20 rounded-xl border-2 border-[#E5E7EB] overflow-hidden shadow-lg bg-white flex items-center justify-center shrink-0">
                {job.employer.user.image ? (
                  <img
                    src={job.employer.user.image}
                    alt="Logo"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex-1">
                {/* Category Badge */}
                <Badge className="mb-3 bg-[#1E40AF]/10 text-[#1E40AF] hover:bg-[#1E40AF]/20 border-[#1E40AF]/20">
                  {job.category}
                </Badge>

                <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-3 leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-2 font-medium text-[#1E40AF]">
                    <Building2 className="h-4 w-4" />
                    {job.employer.user.companyName}
                  </div>
                  <span className="text-[#D1D5DB]">•</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <span className="text-[#D1D5DB]">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#1E40AF]"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onCopy}>
                    {copied ? (
                      <Check className="mr-2 h-4 w-4 text-[#10B981]" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare("linkedin")}>
                    <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />{" "}
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare("twitter")}>
                    <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" /> Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare("facebook")}>
                    <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />{" "}
                    Facebook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                className="border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#1E40AF]"
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              {isTalent ? (
                <ApplyModal
                  jobId={job.id}
                  jobTitle={job.title}
                  profile={talentProfile ?? null}
                  hasApplied={hasApplied}
                >
                  <Button
                    size="lg"
                    className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 font-semibold px-8 shadow-lg shadow-[#1E40AF]/20"
                    disabled={hasApplied}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Apply Now
                      </>
                    )}
                  </Button>
                </ApplyModal>
              ) : (
                <Button
                  size="lg"
                  className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 shadow-lg shadow-[#1E40AF]/20"
                  asChild
                >
                  <Link href="/auth/login">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Apply Now
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OverviewCard
                icon={DollarSign}
                label="Compensation"
                value={
                  job.isPaid
                    ? `${job.currency} ${
                        job.salaryMin ? job.salaryMin / 1000 + "k" : ""
                      } - ${job.salaryMax ? job.salaryMax / 1000 + "k" : ""}`
                    : "Unpaid"
                }
                color="text-[#10B981]"
              />
              <OverviewCard
                icon={Briefcase}
                label="Project Type"
                value={job.projectType}
                color="text-[#1E40AF]"
              />
              <OverviewCard
                icon={Clock}
                label="Duration"
                value={job.duration || "N/A"}
                color="text-[#F59E0B]"
              />
              <OverviewCard
                icon={Calendar}
                label="Deadline"
                value={
                  job.deadline
                    ? format(new Date(job.deadline), "MMM d")
                    : "Ongoing"
                }
                color="text-[#EF4444]"
              />
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
                    <FileText className="h-5 w-5 text-[#1E40AF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    Project Description
                  </h3>
                </div>
                <p className="text-[#4B5563] leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              <Separator className="bg-[#E5E7EB]" />

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
                    <Users className="h-5 w-5 text-[#1E40AF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    Role Requirements
                  </h3>
                </div>

                {job.roleDescription && (
                  <p className="text-[#4B5563] leading-relaxed mb-6 whitespace-pre-wrap">
                    {job.roleDescription}
                  </p>
                )}

                {job.skills.length > 0 && (
                  <div className="mb-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <h4 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#1E40AF]" />
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#374151] hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <RequirementItem label="Gender" value={job.gender || "Any"} />
                  <RequirementItem
                    label="Age Range"
                    value={
                      job.minAge && job.maxAge
                        ? `${job.minAge} - ${job.maxAge} years`
                        : "Open"
                    }
                  />
                  <RequirementItem
                    label="Ethnicity"
                    value={job.ethnicity || "Any"}
                  />
                </div>
              </div>

              {job.auditionDetails && (
                <>
                  <Separator className="bg-[#E5E7EB]" />
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#F59E0B]/10 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#111827]">
                        Audition Details
                      </h3>
                    </div>
                    <div className="bg-linear-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#F59E0B]/20 rounded-lg p-5">
                      <p className="text-[#92400E] leading-relaxed whitespace-pre-wrap">
                        {job.auditionDetails}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden sticky top-24">
              <div className="bg-linear-to-br from-[#1E40AF] to-[#3B82F6] p-6">
                <h3 className="font-bold text-white mb-1">About the Company</h3>
                <p className="text-sm text-white/80">
                  Learn more about the employer
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <Avatar className="h-14 w-14 border-2 border-[#E5E7EB] shadow-sm">
                    <AvatarImage src={job.employer.user.image || ""} />
                    <AvatarFallback className="bg-[#F9FAFB] text-[#1E40AF] font-semibold text-lg">
                      {job.employer.user.companyName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-base text-[#111827] mb-1">
                      {job.employer.user.companyName}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs border-[#E5E7EB] text-[#6B7280]"
                    >
                      {job.employer.industryType}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-[#6B7280] mb-6 leading-relaxed line-clamp-4">
                  {job.employer.companyDescription}
                </p>

                {/* Company Details */}
                <div className="space-y-3 mb-6">
                  {job.employer.websiteUrl && (
                    <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#F3F4F6] transition-colors">
                      <div className="p-2 bg-white rounded-md">
                        <Globe className="h-4 w-4 text-[#1E40AF]" />
                      </div>
                      <a
                        href={job.employer.websiteUrl}
                        target="_blank"
                        className="text-sm text-[#1E40AF] hover:underline font-medium"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                    <div className="p-2 bg-white rounded-md">
                      <MapPin className="h-4 w-4 text-[#1E40AF]" />
                    </div>
                    <span className="text-sm text-[#6B7280]">
                      {job.employer.city}, {job.employer.country}
                    </span>
                  </div>
                </div>

                <Separator className="my-6 bg-[#E5E7EB]" />

                {/* CTA Button */}
                {isTalent ? (
                  <ApplyModal
                    jobId={job.id}
                    jobTitle={job.title}
                    profile={talentProfile ?? null}
                    hasApplied={hasApplied}
                  >
                    <Button
                      className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90 shadow-md"
                      size="lg"
                      disabled={hasApplied}
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  </ApplyModal>
                ) : (
                  <Button
                    className="w-full bg-[#1E40AF] hover:bg-[#1E40AF]/90 shadow-md"
                    size="lg"
                    asChild
                  >
                    <Link href="/auth/login">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Apply Now
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function OverviewCard({ icon: Icon, label, value, color }: any) {
  return (
    <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-5 flex flex-col items-center text-center gap-2">
        <div className="p-2 bg-[#F9FAFB] rounded-lg">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <span className="text-xs text-[#6B7280] font-medium uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm font-bold text-[#111827]">{value}</span>
      </CardContent>
    </Card>
  );
}

function RequirementItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#1E40AF]/30 transition-colors">
      <span className="text-xs text-[#6B7280] uppercase tracking-wide font-medium block mb-2">
        {label}
      </span>
      <span className="font-semibold text-[#111827]">{value}</span>
    </div>
  );
}
