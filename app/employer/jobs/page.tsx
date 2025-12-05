import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { JobCard } from "@/components/employer/job-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Briefcase,
  Search,
  Filter,
  FileText,
  Eye,
  FolderOpen,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getJobsByEmployerId } from "@/data/jobs";
import { JobStatus } from "@prisma/client";
import { JobsSearchInput } from "@/components/employer/job-search-input";

interface EmployerJobsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function EmployerJobsPage({
  searchParams,
}: EmployerJobsPageProps) {
  const session = await auth();

  const params = await searchParams;
  const q = params.q || "";
  const status = params.status as JobStatus | undefined;

  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id) {
    return redirect("/");
  }

  const profile = await getEmployerProfileByUserId(session.user.id);

  if (!profile) {
    return redirect("/employer/settings");
  }

  // Fetch Data
  const jobs = await getJobsByEmployerId(profile.id, q, status);

  // Calculate stats
  const publishedCount = jobs.filter((j) => j.status === "PUBLISHED").length;
  const draftCount = jobs.filter((j) => j.status === "DRAFT").length;
  const closedCount = jobs.filter((j) => j.status === "CLOSED").length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        {/* Title & Action */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-[#1E40AF]" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
                My Jobs
              </h2>
            </div>
            <p className="text-[#6B7280] text-base">
              Manage your job listings and track applicants
            </p>
          </div>
          <Button
            asChild
            className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white shadow-lg shadow-[#1E40AF]/20 transition-all"
            size="lg"
          >
            <Link href="/employer/jobs/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Jobs</p>
                <p className="text-2xl font-bold text-[#111827]">
                  {jobs.length}
                </p>
              </div>
              <div className="p-3 bg-[#1E40AF]/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-[#1E40AF]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Active</p>
                <p className="text-2xl font-bold text-[#10B981]">
                  {publishedCount}
                </p>
              </div>
              <div className="p-3 bg-[#10B981]/10 rounded-lg">
                <Eye className="h-6 w-6 text-[#10B981]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Drafts</p>
                <p className="text-2xl font-bold text-[#F59E0B]">
                  {draftCount}
                </p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <FolderOpen className="h-6 w-6 text-[#F59E0B]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Closed</p>
                <p className="text-2xl font-bold text-[#6B7280]">
                  {closedCount}
                </p>
              </div>
              <div className="p-3 bg-[#6B7280]/10 rounded-lg">
                <XCircle className="h-6 w-6 text-[#6B7280]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search */}
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <div className="pl-10">
                <JobsSearchInput />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm text-[#6B7280] mr-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Filter:</span>
            </div>
            <Button
              variant={!status ? "default" : "outline"}
              size="sm"
              asChild
              className={
                !status
                  ? "bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                  : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }
            >
              <Link href="/employer/jobs">
                <FileText className="h-4 w-4 mr-1" />
                All
                {!status && (
                  <Badge className="ml-2 bg-white text-[#1E40AF] hover:bg-white">
                    {jobs.length}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              variant={status === "PUBLISHED" ? "default" : "outline"}
              size="sm"
              asChild
              className={
                status === "PUBLISHED"
                  ? "bg-[#10B981] hover:bg-[#10B981]/90"
                  : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }
            >
              <Link href="/employer/jobs?status=PUBLISHED">
                <Eye className="h-4 w-4 mr-1" />
                Active
                {status === "PUBLISHED" && (
                  <Badge className="ml-2 bg-white text-[#10B981] hover:bg-white">
                    {publishedCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              variant={status === "DRAFT" ? "default" : "outline"}
              size="sm"
              asChild
              className={
                status === "DRAFT"
                  ? "bg-[#F59E0B] hover:bg-[#F59E0B]/90"
                  : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }
            >
              <Link href="/employer/jobs?status=DRAFT">
                <FolderOpen className="h-4 w-4 mr-1" />
                Drafts
                {status === "DRAFT" && (
                  <Badge className="ml-2 bg-white text-[#F59E0B] hover:bg-white">
                    {draftCount}
                  </Badge>
                )}
              </Link>
            </Button>
            <Button
              variant={status === "CLOSED" ? "default" : "outline"}
              size="sm"
              asChild
              className={
                status === "CLOSED"
                  ? "bg-[#6B7280] hover:bg-[#6B7280]/90"
                  : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              }
            >
              <Link href="/employer/jobs?status=CLOSED">
                <XCircle className="h-4 w-4 mr-1" />
                Closed
                {status === "CLOSED" && (
                  <Badge className="ml-2 bg-white text-[#6B7280] hover:bg-white">
                    {closedCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {(q || status) && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <span>Filtered results:</span>
                <Badge variant="outline" className="font-normal">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#1E40AF] hover:text-[#1E40AF] hover:bg-[#1E40AF]/10"
              >
                <Link href="/employer/jobs">Clear all filters</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-linear-to-br from-[#F9FAFB] to-white rounded-lg border-2 border-dashed border-[#E5E7EB]">
          <div className="max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 bg-[#1E40AF]/10 rounded-full">
              <Briefcase className="h-12 w-12 text-[#1E40AF]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#111827] mb-2">
                {q || status ? "No jobs found" : "No jobs yet"}
              </h3>
              <p className="text-[#6B7280]">
                {q || status
                  ? "Try adjusting your filters or search terms"
                  : "Start by posting your first job listing"}
              </p>
            </div>
            {q || status ? (
              <Button
                variant="outline"
                asChild
                className="border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF]/10"
              >
                <Link href="/employer/jobs">
                  <XCircle className="mr-2 h-4 w-4" />
                  Clear Filters
                </Link>
              </Button>
            ) : (
              <Button asChild className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                <Link href="/employer/jobs/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first job
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
