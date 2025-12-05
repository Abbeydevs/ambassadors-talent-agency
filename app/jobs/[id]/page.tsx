import { getJobById } from "@/data/public-jobs";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { db } from "@/lib/db";
import { RelatedJobs } from "@/components/jobs/related-jobs";
import Link from "next/link";

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
    <div className="min-h-screen bg-linear-to-br from-[#F9FAFB] via-white to-[#F9FAFB]">
      <div className="bg-linear-to-r from-[#1E40AF] via-[#3B82F6] to-[#1E40AF] border-b border-[#1E40AF]/20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center gap-3 text-white/90 text-sm mb-4">
            <Link href="/jobs" className="hover:text-white transition-colors">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Job Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-4">
        <div className="bg-white rounded-lg shadow-xl border border-[#E5E7EB] overflow-hidden">
          <JobDetailView
            job={job}
            isTalent={isTalent}
            talentProfile={talentProfile}
            hasApplied={hasApplied}
          />
        </div>

        <RelatedJobs
          currentJobId={job.id}
          category={job.category}
          savedJobIds={savedJobIds}
        />
      </div>

      <div className="h-32 bg-linear-to-t from-[#F9FAFB] to-transparent"></div>
    </div>
  );
}
