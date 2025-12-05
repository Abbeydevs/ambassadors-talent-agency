import { getJobById } from "@/data/public-jobs";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { db } from "@/lib/db";
import { RelatedJobs } from "@/components/jobs/related-jobs";

interface JobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJobById(id);
  const session = await auth();

  if (!job) {
    return notFound();
  }

  let savedJobIds: string[] = [];
  let talentProfile = null;
  let hasApplied = false;

  if (session?.user?.id && session.user.role === "TALENT") {
    talentProfile = await getTalentProfileByUserId(session.user.id);

    if (talentProfile) {
      const saved = await db.savedJob.findMany({
        where: { talentId: talentProfile.id },
        select: { jobId: true },
      });
      savedJobIds = saved.map((s) => s.jobId);

      const application = await db.application.findUnique({
        where: {
          jobId_talentId: {
            jobId: job.id,
            talentId: talentProfile.id,
          },
        },
      });
      hasApplied = !!application;
    }
  }

  const isTalent = session?.user?.role === "TALENT";

  return (
    <div className="pb-10">
      <JobDetailView
        job={job}
        isTalent={isTalent}
        talentProfile={talentProfile}
        hasApplied={hasApplied}
      />
      ;
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <RelatedJobs
          currentJobId={job.id}
          category={job.category}
          savedJobIds={savedJobIds}
        />
      </div>
    </div>
  );
}
