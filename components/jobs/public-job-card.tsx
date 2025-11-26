/* eslint-disable @next/next/no-img-element */
"use client";

import { Job, EmployerProfile, User } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Briefcase, Building2, Bookmark } from "lucide-react";
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
    <Card className="hover:shadow-md transition-shadow group relative overflow-hidden border-l-4 border-l-transparent hover:border-l-[#1E40AF]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="h-12 w-12 rounded-lg border bg-white p-1 flex items-center justify-center shrink-0">
            {job.employer.user.image ? (
              <img
                src={job.employer.user.image}
                alt="Logo"
                className="object-cover h-full w-full rounded-md"
              />
            ) : (
              <Building2 className="h-6 w-6 text-slate-300" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-slate-900 truncate pr-2">
                <Link href={`/jobs/${job.id}`} className="hover:underline">
                  {job.title}
                </Link>
              </h3>
              {job.isFeatured && (
                <Badge className="bg-amber-500 hover:bg-amber-600 border-0 text-[10px] px-1.5 h-5">
                  Featured
                </Badge>
              )}
              <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                {job.projectType}
              </Badge>
            </div>

            <p className="text-sm text-slate-500 mb-3 flex items-center gap-1">
              <span className="font-medium text-slate-700">
                {job.employer.user.companyName}
              </span>
              <span>•</span>
              <span>{job.category}</span>
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.isPaid
                  ? `${job.currency} ${
                      job.salaryMin ? job.salaryMin / 1000 + "k" : ""
                    } - ${job.salaryMax ? job.salaryMax / 1000 + "k" : ""}`
                  : "Unpaid"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(job.createdAt), "MMM d")}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-[#1E40AF]"
            onClick={onToggleSave}
            disabled={isPending}
          >
            <Bookmark
              className={`h-5 w-5 ${
                saved ? "fill-[#1E40AF] text-[#1E40AF]" : ""
              }`}
            />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 px-6 py-3 flex justify-between items-center">
        <p className="text-xs text-slate-500 line-clamp-1 max-w-[60%]">
          {job.skills.slice(0, 3).join(" • ")}
        </p>
        <Button
          asChild
          size="sm"
          className="bg-[#1E40AF] hover:bg-[#1E40AF]/90"
        >
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
