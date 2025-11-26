import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { JobCard } from "@/components/employer/job-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Jobs</h2>
          <p className="text-muted-foreground">
            Manage your listings and view applicants.
          </p>
        </div>
        <Button asChild className="bg-[#1E40AF]">
          <Link href="/employer/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <JobsSearchInput />

        <div className="flex gap-2">
          <Button variant={!status ? "secondary" : "ghost"} size="sm" asChild>
            <Link href="/employer/jobs">All</Link>
          </Button>
          <Button
            variant={status === "PUBLISHED" ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/employer/jobs?status=PUBLISHED">Active</Link>
          </Button>
          <Button
            variant={status === "DRAFT" ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/employer/jobs?status=DRAFT">Drafts</Link>
          </Button>
          <Button
            variant={status === "CLOSED" ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/employer/jobs?status=CLOSED">Closed</Link>
          </Button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
          <p className="text-slate-500 mb-4">
            {q || status
              ? "No jobs found matching your filters."
              : "You haven't posted any jobs yet."}
          </p>
          {q || status ? (
            <Button variant="link" asChild>
              <Link href="/employer/jobs">Clear Filters</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/employer/jobs/new">Create your first job</Link>
            </Button>
          )}
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
