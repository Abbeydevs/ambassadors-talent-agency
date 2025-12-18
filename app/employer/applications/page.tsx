import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { getAllApplicationsByEmployerId } from "@/data/applications";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ApplicationStatus } from "@prisma/client";
import { ApplicationsFilter } from "@/components/employer/applications-filter";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SHORTLISTED":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "HIRED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "REJECTED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Applications</h2>
        <p className="text-muted-foreground">
          A centralized view of all candidates across all your jobs.
        </p>
      </div>

      <ApplicationsFilter />

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Applied For</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={app.talent.user.image || ""} />
                        <AvatarFallback>
                          {app.talent.user.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {app.talent.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.talent.user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {app.job.title}
                  </TableCell>
                  <TableCell>
                    {format(new Date(app.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-md font-normal ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/employer/jobs/${app.jobId}/applications`}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
