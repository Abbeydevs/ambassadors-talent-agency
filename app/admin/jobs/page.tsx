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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-gray-900 font-medium">Failed to load jobs</p>
          <p className="text-sm text-gray-500 mt-1">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            Job Postings
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Moderate and manage job listings on your platform
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2">
          <span className="text-sm text-gray-500">Total Jobs:</span>
          <span className="text-lg font-bold text-gray-900">
            {result.success.length}
          </span>
        </div>
      </div>

      <JobsTable jobs={result.success} />
    </div>
  );
}
