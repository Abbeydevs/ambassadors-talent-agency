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
  Filter,
  MapPin,
  Users,
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
          <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200 shadow-sm font-medium">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Live
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm font-medium">
            Pending Review
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-700 hover:bg-red-100 border border-red-200 font-medium"
          >
            Rejected
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-600 hover:bg-gray-100 border border-gray-200 font-medium"
          >
            Draft
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-600 border-gray-300 font-medium"
          >
            Closed
          </Badge>
        );
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

  const publishedCount = jobs.filter((j) => j.status === "PUBLISHED").length;
  const pendingCount = jobs.filter((j) => j.status === "PENDING").length;
  const totalApplications = jobs.reduce(
    (sum, j) => sum + j._count.applications,
    0
  );

  return (
    <div className="space-y-6">
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs or companies..."
            className="pl-10 bg-white border-gray-200 focus-visible:ring-blue-600 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="border-gray-200 hover:bg-gray-50 h-10"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Total Jobs</p>
            <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Published</p>
            <div className="h-8 w-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Pending Review</p>
            <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <XCircle className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">
              Total Applications
            </p>
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {totalApplications}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-linear-to-r from-gray-50 to-gray-100/50 hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100/50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-900 py-4">
                Job Title
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Company
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Applications
              </TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">
                Posted Date
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-900 py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Briefcase className="h-12 w-12 mb-2 text-gray-300" />
                    <p className="font-medium">No jobs found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow
                  key={job.id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200"
                >
                  <TableCell>
                    <div className="flex flex-col py-1">
                      <span className="flex items-center gap-2 font-semibold text-sm text-gray-900">
                        {job.title}
                        {job.isFeatured && (
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        )}
                      </span>
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {job.employer.user.companyName || "Unknown Company"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-sm">
                        {job._count.applications}
                      </span>
                      <span className="text-xs text-gray-400">applicants</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 text-sm font-medium">
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 shadow-lg border-gray-200"
                      >
                        <DropdownMenuLabel className="text-gray-900 font-semibold">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleFeature(job.id, job.isFeatured)
                          }
                          className="cursor-pointer"
                        >
                          {job.isFeatured ? (
                            <>
                              <StarOff className="h-4 w-4 mr-2 text-amber-600" />
                              Remove Feature
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2 text-amber-600" />
                              Feature Job
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status !== "REJECTED" && (
                          <DropdownMenuItem
                            onClick={() => onModerate(job.id, "REJECTED")}
                            className="cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Flag as Inappropriate
                          </DropdownMenuItem>
                        )}
                        {job.status !== "PUBLISHED" && (
                          <DropdownMenuItem
                            onClick={() => onModerate(job.id, "PUBLISHED")}
                            className="cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Approve / Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setEditingJob(job)}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Content
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setJobToDelete(job.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Job
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

      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between text-sm bg-white border border-gray-200 rounded-lg px-5 py-3">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredJobs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{jobs.length}</span>{" "}
            jobs
          </p>
        </div>
      )}
    </div>
  );
};
