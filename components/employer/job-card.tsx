"use client";

import { Job } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  MoreHorizontal,
  Pencil,
  Eye,
  Copy,
  Trash2,
  Loader2,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteJob } from "@/actions/employer/delete-job";
import { duplicateJob } from "@/actions/employer/duplicate-job";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JobCardProps {
  job: Job & {
    _count: { applications: number };
    views: number;
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const isPublished = job.status === "PUBLISHED";
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onDuplicate = () => {
    startTransition(() => {
      duplicateJob(job.id)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success(data.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = () => {
    startTransition(() => {
      deleteJob(job.id)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else {
            toast.success(data.success);
            setShowDeleteDialog(false);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-[#E5E7EB] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#111827] text-xl">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#6B7280] text-base">
              This will permanently delete the job listing{" "}
              <strong className="text-[#111827]">
                &quot;{job.title}&quot;
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              className="border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={isPending}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
            >
              {isPending ? "Deleting..." : "Delete Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card
        className={`group relative overflow-hidden border-[#E5E7EB] hover:border-[#1E40AF] transition-all duration-300 hover:shadow-lg ${
          job.isFeatured
            ? "border-[#8B5CF6] bg-linear-to-br from-white to-purple-50/30 shadow-md"
            : "bg-white"
        }`}
      >
        {job.isFeatured && (
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
            <div className="absolute top-4 -right-8 rotate-45 bg-[#8B5CF6] text-white text-xs font-semibold py-1 px-10 shadow-sm">
              Featured
            </div>
          </div>
        )}

        <CardContent className="p-7 z-50">
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-xl text-[#111827] line-clamp-1 hover:text-[#1E40AF] transition-colors">
                  {job.title}
                </h3>
                <Badge
                  variant={isPublished ? "default" : "secondary"}
                  className={`px-3 py-1 rounded-full font-medium text-xs ${
                    isPublished
                      ? "bg-[#10B981] hover:bg-[#059669] text-white border-0"
                      : "bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]"
                  }`}
                >
                  {job.status === "PUBLISHED" ? "Active" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]">
                  {job.category}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] opacity-0 group-hover:opacity-100 transition-all"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#6B7280]" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 border-[#E5E7EB] shadow-lg rounded-xl"
              >
                <DropdownMenuItem
                  asChild
                  className="hover:bg-[#F9FAFB] cursor-pointer py-2.5"
                >
                  <Link
                    href={`/employer/jobs/${job.id}/edit`}
                    className="flex items-center"
                  >
                    <Pencil className="mr-3 h-4 w-4 text-[#6B7280]" />
                    <span className="text-[#111827] font-medium">Edit Job</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-[#F9FAFB] cursor-pointer py-2.5"
                >
                  <Link
                    href={`/jobs/${job.id}`}
                    target="_blank"
                    className="flex items-center"
                  >
                    <Eye className="mr-3 h-4 w-4 text-[#6B7280]" />
                    <span className="text-[#111827] font-medium">
                      View Public Page
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDuplicate}
                  className="hover:bg-[#F9FAFB] cursor-pointer py-2.5"
                >
                  <Copy className="mr-3 h-4 w-4 text-[#6B7280]" />
                  <span className="text-[#111827] font-medium">Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E5E7EB]" />
                <DropdownMenuItem
                  className="text-[#EF4444] hover:bg-red-50 focus:bg-red-50 cursor-pointer py-2.5"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-3 h-4 w-4" />
                  <span className="font-medium">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Location and Date */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <MapPin className="h-4 w-4 text-[#9CA3AF]" />
              <span className="truncate font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Calendar className="h-4 w-4 text-[#9CA3AF]" />
              <span className="font-medium">
                {format(new Date(job.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-4 pt-5 border-t border-[#E5E7EB]">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-linear-to-br from-blue-50 to-blue-100/30 rounded-lg border border-blue-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Users className="h-4 w-4 text-[#1E40AF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#6B7280] font-medium">
                    Applicants
                  </span>
                  <span className="text-lg font-bold text-[#111827]">
                    {job._count?.applications || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-linear-to-br from-purple-50 to-purple-100/30 rounded-lg border border-purple-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <BarChart3 className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#6B7280] font-medium">
                    Views
                  </span>
                  <span className="text-lg font-bold text-[#111827]">
                    {job.views || 0}
                  </span>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-semibold py-2.5 h-auto rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Link href={`/employer/jobs/${job.id}/applications`}>
                Manage Candidates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
