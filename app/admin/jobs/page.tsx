import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminJobs } from "@/actions/admin/get-jobs";
import { JobsTable } from "@/components/admin/jobs-table";
import { Briefcase } from "lucide-react";

export default async function AdminJobsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const result = await getAdminJobs();

  if (result.error || !result.success) {
    return <div>Failed to load jobs</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-slate-600" />
            Job Postings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Moderate and manage job listings.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Total: <strong>{result.success.length}</strong>
        </div>
      </div>

      <JobsTable jobs={result.success} />
    </div>
  );
}
