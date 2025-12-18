import { auth } from "@/auth";
import { getApplicationsByJobId } from "@/data/applications";
import { db } from "@/lib/db";
import { ApplicantCard } from "@/components/employer/applicant-card";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

interface ApplicationsPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function ApplicationsPage({
  params,
}: ApplicationsPageProps) {
  const { jobId } = await params;
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER") return redirect("/");

  const job = await db.job.findUnique({
    where: { id: jobId },
    select: { title: true, employerId: true },
  });

  if (!job) return notFound();

  const employerProfile = await db.employerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!employerProfile || job.employerId !== employerProfile.id) {
    return redirect("/employer/jobs");
  }

  const applications = await getApplicationsByJobId(jobId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/employer/jobs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground text-sm">
            Managing candidates for{" "}
            <span className="font-medium text-slate-900">{job.title}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Total Candidates
            </p>
            <div className="text-4xl font-bold mt-2">{applications.length}</div>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-4">
            <Users className="h-4 w-4" />
            <span>Applicants found</span>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed">
          <p className="text-slate-500">No applications received yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {applications.map((app) => (
            <ApplicantCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
