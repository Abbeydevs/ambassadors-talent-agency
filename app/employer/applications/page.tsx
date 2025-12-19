import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { getAllApplicationsByEmployerId } from "@/data/applications";
import { redirect } from "next/navigation";
import { Users, FileText, CheckCircle2, XCircle } from "lucide-react";

import { ApplicationStatus } from "@prisma/client";
import { ApplicationsFilter } from "@/components/employer/applications-filter";
import { ApplicationsTable } from "@/components/employer/applications-table";

interface AllApplicationsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AllApplicationsPage({
  searchParams,
}: AllApplicationsPageProps) {
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id)
    return redirect("/");

  const profile = await getEmployerProfileByUserId(session.user.id);
  if (!profile) return redirect("/employer/settings");

  const params = await searchParams;
  const status = params.status
    ? (params.status as ApplicationStatus)
    : undefined;
  const search = params.search || undefined;

  const applications = await getAllApplicationsByEmployerId(
    profile.id,
    status,
    search
  );

  // Calculate stats
  const totalApplications = applications.length;
  const shortlistedCount = applications.filter(
    (app) => app.status === "SHORTLISTED"
  ).length;
  const hiredCount = applications.filter(
    (app) => app.status === "HIRED"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "REJECTED"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#1E40AF]/10 rounded-lg">
            <Users className="h-6 w-6 text-[#1E40AF]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#111827]">
              All Applications
            </h2>
            <p className="text-[#6B7280] text-base mt-1">
              A centralized view of all candidates across all your jobs
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1 font-medium">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-[#111827]">
                  {totalApplications}
                </p>
              </div>
              <div className="p-3 bg-[#1E40AF]/10 rounded-lg">
                <FileText className="h-6 w-6 text-[#1E40AF]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1 font-medium">
                  Shortlisted
                </p>
                <p className="text-3xl font-bold text-[#F59E0B]">
                  {shortlistedCount}
                </p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-[#F59E0B]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1 font-medium">Hired</p>
                <p className="text-3xl font-bold text-[#10B981]">
                  {hiredCount}
                </p>
              </div>
              <div className="p-3 bg-[#10B981]/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-[#10B981]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1 font-medium">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-[#EF4444]">
                  {rejectedCount}
                </p>
              </div>
              <div className="p-3 bg-[#EF4444]/10 rounded-lg">
                <XCircle className="h-6 w-6 text-[#EF4444]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicationsFilter />

      <ApplicationsTable applications={applications} />
    </div>
  );
}
