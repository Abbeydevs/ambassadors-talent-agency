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
  job: Job;
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job listing{" "}
              <strong>&quot;{job.title}&quot;</strong>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="hover:shadow-md transition-shadow group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1">
                  {job.title}
                </h3>
                <Badge
                  variant={isPublished ? "default" : "secondary"}
                  className={
                    isPublished
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-slate-200 text-slate-600"
                  }
                >
                  {job.status === "PUBLISHED" ? "Active" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">{job.category}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/employer/jobs/${job.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Job
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {/* Link to the public page we built earlier */}
                  <Link href={`/jobs/${job.id}`} target="_blank">
                    <Eye className="mr-2 h-4 w-4" /> View Public Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              {format(new Date(job.createdAt), "MMM d, yyyy")}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-blue-50 rounded-full text-blue-600">
                <Users className="h-4 w-4" />
              </div>
              <span className="font-medium text-slate-900">0 Applicants</span>
            </div>

            <Button asChild variant="outline" size="sm" className="text-xs">
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
