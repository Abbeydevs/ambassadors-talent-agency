"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  MoreHorizontal,
  Briefcase,
  Pencil,
  Trash,
  Eye,
  Loader2,
  Star,
  StarOff,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditJobDialog } from "./edit-job-dialog";
import { deleteJob } from "@/actions/admin/delete-job";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toggleJobFeature } from "@/actions/admin/feature-job";
import { moderateJob } from "@/actions/admin/moderate-job";

interface JobWithEmployer {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  location: string;
  description: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  isFeatured: boolean;
  employer: {
    user: {
      name: string | null;
      email: string | null;
      companyName: string | null;
    };
  };
  _count: {
    applications: number;
  };
}

interface JobsTableProps {
  jobs: JobWithEmployer[];
}

export const JobsTable = ({ jobs }: JobsTableProps) => {
  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState<JobWithEmployer | null>(null);
  const [isPending, startTransition] = useTransition();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.employer.user.companyName
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const executeDelete = () => {
    if (!jobToDelete) return;

    startTransition(() => {
      deleteJob(jobToDelete)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            setJobToDelete(null);
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onModerate = (jobId: string, newStatus: "PUBLISHED" | "REJECTED") => {
    startTransition(() => {
      moderateJob(jobId, newStatus)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success(data.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            Live
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            Pending Review
          </Badge>
        );
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>;
      case "CLOSED":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const onToggleFeature = (jobId: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleJobFeature(jobId, !currentStatus)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success(data.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="space-y-4">
      {editingJob && (
        <EditJobDialog
          isOpen={!!editingJob}
          onClose={() => setEditingJob(null)}
          job={{
            id: editingJob.id,
            title: editingJob.title,
            description: editingJob.description || "",
            location: editingJob.location,
            salaryMin: editingJob.salaryMin,
            salaryMax: editingJob.salaryMax,
          }}
        />
      )}

      <AlertDialog
        open={!!jobToDelete}
        onOpenChange={() => setJobToDelete(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                executeDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-8 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2 font-medium text-sm text-slate-900">
                        {job.title}
                        {job.isFeatured && (
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        )}
                      </span>

                      <span className="text-xs text-slate-500">
                        {job.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">
                        {job.employer.user.companyName || "Unknown Company"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-medium">
                        {job._count.applications}
                      </span>
                      <span className="text-xs text-slate-400">applicants</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleFeature(job.id, job.isFeatured)
                          }
                        >
                          {job.isFeatured ? (
                            <>
                              <StarOff className="h-4 w-4 text-amber-600" />{" "}
                              Remove Feature
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 text-amber-600" />{" "}
                              Feature Job
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status !== "REJECTED" && (
                          <DropdownMenuItem
                            onClick={() => onModerate(job.id, "REJECTED")}
                          >
                            <XCircle className="h-4 w-4 text-red-500" /> Flag as
                            Inappropriate
                          </DropdownMenuItem>
                        )}
                        {job.status !== "PUBLISHED" && (
                          <DropdownMenuItem
                            onClick={() => onModerate(job.id, "PUBLISHED")}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />{" "}
                            Approve / Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingJob(job)}>
                          <Pencil className="h-4 w-4" /> Edit Content
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setJobToDelete(job.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash className="h-4 w-4" /> Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
