import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { JobCard } from "@/components/employer/job-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Briefcase,
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
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
        {/* Search Input */}
        <div className="mb-5">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div>
              <JobsSearchInput />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6B7280]">
            <Filter className="h-4 w-4" />
            <span>Filter by Status</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={!status ? "default" : "outline"}
              size="sm"
              asChild
              className={`rounded-full transition-all ${
                !status
                  ? "bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-sm"
                  : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] hover:border-[#1E40AF] hover:text-[#1E40AF]"
              }`}
            >
              <Link href="/employer/jobs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>All Jobs</span>
                <Badge
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    !status
                      ? "bg-white/20 text-white hover:bg-white/20"
                      : "bg-[#F9FAFB] text-[#6B7280]"
                  }`}
                >
                  {jobs.length}
                </Badge>
              </Link>
            </Button>

            <Button
              variant={status === "PUBLISHED" ? "default" : "outline"}
              size="sm"
              asChild
              className={`rounded-full transition-all ${
                status === "PUBLISHED"
                  ? "bg-[#10B981] hover:bg-[#059669] text-white shadow-sm"
                  : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] hover:border-[#10B981] hover:text-[#10B981]"
              }`}
            >
              <Link
                href="/employer/jobs?status=PUBLISHED"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                <span>Active</span>
                <Badge
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    status === "PUBLISHED"
                      ? "bg-white/20 text-white hover:bg-white/20"
                      : "bg-[#F9FAFB] text-[#6B7280]"
                  }`}
                >
                  {publishedCount}
                </Badge>
              </Link>
            </Button>

            <Button
              variant={status === "DRAFT" ? "default" : "outline"}
              size="sm"
              asChild
              className={`rounded-full transition-all ${
                status === "DRAFT"
                  ? "bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-sm"
                  : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] hover:border-[#F59E0B] hover:text-[#F59E0B]"
              }`}
            >
              <Link
                href="/employer/jobs?status=DRAFT"
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                <span>Drafts</span>
                <Badge
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    status === "DRAFT"
                      ? "bg-white/20 text-white hover:bg-white/20"
                      : "bg-[#F9FAFB] text-[#6B7280]"
                  }`}
                >
                  {draftCount}
                </Badge>
              </Link>
            </Button>

            <Button
              variant={status === "CLOSED" ? "default" : "outline"}
              size="sm"
              asChild
              className={`rounded-full transition-all ${
                status === "CLOSED"
                  ? "bg-[#6B7280] hover:bg-[#4B5563] text-white shadow-sm"
                  : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] hover:border-[#6B7280]"
              }`}
            >
              <Link
                href="/employer/jobs?status=CLOSED"
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Closed</span>
                <Badge
                  className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    status === "CLOSED"
                      ? "bg-white/20 text-white hover:bg-white/20"
                      : "bg-[#F9FAFB] text-[#6B7280]"
                  }`}
                >
                  {closedCount}
                </Badge>
              </Link>
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(q || status) && (
          <div className="mt-5 pt-5 border-t border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#6B7280]">
                  Showing Results:
                </span>
                <Badge
                  variant="outline"
                  className="bg-[#1E40AF]/5 border-[#1E40AF]/20 text-[#1E40AF] font-semibold rounded-full px-3 py-1"
                >
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#1E40AF] hover:text-[#1E3A8A] hover:bg-[#1E40AF]/10 rounded-full font-medium"
              >
                <Link
                  href="/employer/jobs"
                  className="flex items-center gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  Clear all filters
                </Link>
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
            <JobCard
              key={job.id}
              job={{
                ...job,
                _count: { applications: 0 },
                views: job.views || 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
