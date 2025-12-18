import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { getAllApplicationsByEmployerId } from "@/data/applications";
import { redirect } from "next/navigation";

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Applications</h2>
        <p className="text-muted-foreground">
          A centralized view of all candidates across all your jobs.
        </p>
      </div>

      <ApplicationsFilter />

      <ApplicationsTable applications={applications} />
    </div>
  );
}
