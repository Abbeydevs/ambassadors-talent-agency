import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CreateJobForm } from "@/components/employer/create-job-form";
import { redirect, notFound } from "next/navigation";

interface EditJobPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER") {
    return redirect("/");
  }

  const { jobId } = await params;

  const job = await db.job.findUnique({
    where: { id: jobId },
    include: { employer: true },
  });

  if (!job) {
    return notFound();
  }

  const employerProfile = await db.employerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!employerProfile || job.employerId !== employerProfile.id) {
    return redirect("/employer/jobs");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Job</h2>
        <p className="text-muted-foreground">
          Update details for{" "}
          <span className="font-medium text-slate-900">{job.title}</span>
        </p>
      </div>

      <CreateJobForm initialData={job} />
    </div>
  );
}
