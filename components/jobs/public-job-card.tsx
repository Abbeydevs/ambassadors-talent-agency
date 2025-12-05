/* eslint-disable @next/next/no-img-element */
"use client";

import { Job, EmployerProfile, User } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Building2,
  Bookmark,
  DollarSign,
  Star,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleSaveJob } from "@/actions/talent/toggle-save-job";
import { toast } from "sonner";

type FullJob = Job & {
  employer: EmployerProfile & {
    user: User;
  };
};

interface PublicJobCardProps {
  job: FullJob;
  isSaved?: boolean;
}

export const PublicJobCard = ({ job, isSaved = false }: PublicJobCardProps) => {
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSaved((prev) => !prev);

    startTransition(() => {
      toggleSaveJob(job.id)
        .then((data) => {
          if (data.error) {
            setSaved((prev) => !prev);
            if (data.error === "Unauthorized") {
              router.push("/auth/login");
            } else {
              toast.error(data.error);
            }
          } else {
            toast.success(data.success);
          }
        })
        .catch(() => {
          setSaved((prev) => !prev);
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 group relative overflow-hidden border border-[#E5E7EB] hover:border-[#1E40AF] bg-white">
        {/* Featured Badge Ribbon */}
        {job.isFeatured && (
          <div className="absolute top-0 right-0 z-10">
            <div className="bg-linear-to-br from-[#F59E0B] to-[#D97706] text-white text-xs font-semibold px-3 py-1.5 rounded-bl-lg shadow-md flex items-center gap-1">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </div>
          </div>
        )}

        <div className="h-1.5 w-full bg-linear-to-r from-[#1E40AF] to-[#3B82F6] group-hover:h-2 transition-all duration-300"></div>

        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-14 w-14 rounded-xl border-2 border-[#E5E7EB] bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#1E40AF] transition-colors">
              {job.employer.user.image ? (
                <img
                  src={job.employer.user.image}
                  alt="Logo"
                  className="object-cover h-full w-full rounded-lg"
                />
              ) : (
                <Building2 className="h-7 w-7 text-[#9CA3AF]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-[#111827] mb-2 line-clamp-2 group-hover:text-[#1E40AF] transition-colors leading-tight">
                {job.title}
              </h3>

              <div className="flex items-center gap-2 mb-3 text-sm">
                <span className="font-medium text-[#1E40AF]">
                  {job.employer.user.companyName}
                </span>
                <span className="text-[#D1D5DB]">•</span>
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]"
                >
                  {job.category}
                </Badge>
              </div>

              <Badge className="bg-[#1E40AF]/10 text-[#1E40AF] hover:bg-[#1E40AF]/20 text-xs border-0">
                {job.projectType}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#9CA3AF] hover:text-[#1E40AF] hover:bg-[#1E40AF]/10 transition-colors shrink-0"
              onClick={onToggleSave}
              disabled={isPending}
            >
              <Bookmark
                className={`h-5 w-5 transition-all ${
                  saved ? "fill-[#1E40AF] text-[#1E40AF] scale-110" : ""
                }`}
              />
            </Button>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <div className="p-1.5 bg-[#F9FAFB] rounded-md">
                <MapPin className="h-4 w-4 text-[#1E40AF]" />
              </div>
              <span className="font-medium">{job.location}</span>
            </div>

            <div className="flex items-center gap-2 text-[#6B7280]">
              <div className="p-1.5 bg-[#F9FAFB] rounded-md">
                <DollarSign className="h-4 w-4 text-[#10B981]" />
              </div>
              <span
                className={`font-medium ${job.isPaid ? "text-[#10B981]" : ""}`}
              >
                {job.isPaid
                  ? `${job.currency} ${
                      job.salaryMin ? job.salaryMin / 1000 + "k" : ""
                    } - ${job.salaryMax ? job.salaryMax / 1000 + "k" : ""}`
                  : "Unpaid"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#6B7280]">
              <div className="p-1.5 bg-[#F9FAFB] rounded-md">
                <Calendar className="h-4 w-4 text-[#F59E0B]" />
              </div>
              <span>
                Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-linear-to-br from-[#F9FAFB] to-[#F3F4F6] px-6 py-4 flex justify-between items-center border-t border-[#E5E7EB]">
          <div className="flex-1 min-w-0 mr-3">
            {job.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 bg-white text-[#6B7280] rounded border border-[#E5E7EB]"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="text-xs px-2 py-0.5 text-[#9CA3AF]">
                    +{job.skills.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-[#9CA3AF]">No skills listed</span>
            )}
          </div>

          <Button
            size="sm"
            className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 shadow-sm group-hover:shadow-md transition-all shrink-0"
          >
            View
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
