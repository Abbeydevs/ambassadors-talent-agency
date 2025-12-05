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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-lg border border-slate-100 overflow-hidden shadow-sm bg-white flex items-center justify-center">
                {job.employer.user.image ? (
                  <img
                    src={job.employer.user.image}
                    alt="Logo"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
                  <span className="font-medium text-[#1E40AF]">
                    {job.employer.user.companyName}
                  </span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{format(new Date(job.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onCopy}>
                    {copied ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare("linkedin")}>
                    <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare("twitter")}>
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare("facebook")}>
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon">
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
                    className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 font-semibold px-8"
                    disabled={hasApplied}
                  >
                    {hasApplied ? "Applied" : "Apply Now"}
                  </Button>
                </ApplyModal>
              ) : (
                <Button size="lg" className="bg-[#1E40AF]" asChild>
                  <Link href="/auth/login">Apply Now</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <OverviewCard
                icon={DollarSign}
                label="Pay"
                value={
                  job.isPaid
                    ? `${job.currency} ${
                        job.salaryMin ? job.salaryMin / 1000 + "k" : ""
                      } - ${job.salaryMax ? job.salaryMax / 1000 + "k" : ""}`
                    : "Unpaid"
                }
              />
              <OverviewCard
                icon={Briefcase}
                label="Type"
                value={job.projectType}
              />
              <OverviewCard
                icon={Clock}
                label="Duration"
                value={job.duration || "N/A"}
              />
              <OverviewCard
                icon={Calendar}
                label="Deadline"
                value={
                  job.deadline
                    ? format(new Date(job.deadline), "MMM d")
                    : "Ongoing"
                }
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-8">
              {/* Description */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Project Description
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </section>

              <Separator />

              {/* Role Requirements */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Role Requirements
                </h3>
                {job.roleDescription && (
                  <p className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">
                    {job.roleDescription}
                  </p>
                )}

                {/* Skills Grid */}
                {job.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      Required Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <RequirementItem label="Gender" value={job.gender || "Any"} />
                  <RequirementItem
                    label="Age Range"
                    value={
                      job.minAge && job.maxAge
                        ? `${job.minAge} - ${job.maxAge}`
                        : "Open"
                    }
                  />
                  <RequirementItem
                    label="Ethnicity"
                    value={job.ethnicity || "Any"}
                  />
                </div>
              </section>

              <Separator />

              {/* Audition Details */}
              {job.auditionDetails && (
                <section>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Audition Details
                  </h3>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-900 text-sm leading-relaxed">
                    {job.auditionDetails}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Company & Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">
                About the Company
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={job.employer.user.image || ""} />
                  <AvatarFallback className="bg-slate-100">
                    {job.employer.user.companyName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {job.employer.user.companyName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {job.employer.industryType}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6 line-clamp-4">
                {job.employer.companyDescription}
              </p>

              <div className="space-y-3 text-sm">
                {job.employer.websiteUrl && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="h-4 w-4" />
                    <a
                      href={job.employer.websiteUrl}
                      target="_blank"
                      className="text-[#1E40AF] hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {job.employer.city}, {job.employer.country}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <Button className="w-full bg-[#1E40AF]" size="lg">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function OverviewCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="border-none shadow-none bg-white">
      <CardContent className="p-4 flex flex-col items-center text-center gap-2">
        <Icon className="h-5 w-5 text-[#1E40AF]" />
        <span className="text-xs text-slate-500 font-medium uppercase">
          {label}
        </span>
        <span className="text-sm font-bold text-slate-900">{value}</span>
      </CardContent>
    </Card>
  );
}

function RequirementItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
