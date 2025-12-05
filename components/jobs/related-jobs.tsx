import { getRelatedJobs } from "@/data/public-jobs";
import { PublicJobCard } from "@/components/jobs/public-job-card";
import { Separator } from "@/components/ui/separator";

interface RelatedJobsProps {
  currentJobId: string;
  category: string;
  savedJobIds: string[];
}

export const RelatedJobs = async ({
  currentJobId,
  category,
  savedJobIds,
}: RelatedJobsProps) => {
  const jobs = await getRelatedJobs(currentJobId, category);

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <Separator className="mb-8" />
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Similar Jobs You Might Like
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <PublicJobCard
            key={job.id}
            job={job}
            isSaved={savedJobIds.includes(job.id)}
          />
        ))}
      </div>
    </div>
  );
};
