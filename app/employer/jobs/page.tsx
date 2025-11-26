import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { JobCard } from "@/components/employer/job-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getJobsByEmployerId } from "@/data/jobs";

export default async function EmployerJobsPage() {
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id) {
    return redirect("/");
  }

  const profile = await getEmployerProfileByUserId(session.user.id);

  if (!profile) {
    return redirect("/employer/settings");
  }

  const jobs = await getJobsByEmployerId(profile.id);

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

      {/* Filters & Search */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search jobs..."
            className="pl-10 bg-slate-50 border-0"
          />
        </div>
      </div>

      {/* Job Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
          <p className="text-slate-500 mb-4">
            You haven&apos;t posted any jobs yet.
          </p>
          <Button variant="outline" asChild>
            <Link href="/employer/jobs/new">Create your first job</Link>
          </Button>
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
