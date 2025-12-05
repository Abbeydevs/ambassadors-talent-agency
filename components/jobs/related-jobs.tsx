import { getRelatedJobs } from "@/data/public-jobs";
import { PublicJobCard } from "@/components/jobs/public-job-card";
import { Separator } from "@/components/ui/separator";
import { Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

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
      <Separator className="mb-8 bg-linear-to-r from-transparent via-[#E5E7EB] to-transparent h-px" />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-linear-to-br from-[#1E40AF] to-[#3B82F6] rounded-lg shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-[#111827]">
            Similar Opportunities
          </h3>
        </div>
        <p className="text-[#6B7280] text-base ml-14">
          Discover more positions in{" "}
          <span className="font-medium text-[#1E40AF]">{category}</span> that
          might interest you
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <PublicJobCard
            key={job.id}
            job={job}
            isSaved={savedJobIds.includes(job.id)}
          />
        ))}
      </div>

      <div className="mt-10 p-6 bg-linear-to-br from-[#F9FAFB] to-white border border-[#E5E7EB] rounded-xl text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-[#1E40AF]/10 rounded-full">
            <Sparkles className="h-6 w-6 text-[#1E40AF]" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-[#111827] mb-2">
          Looking for more opportunities?
        </h4>
        <p className="text-sm text-[#6B7280] mb-4 max-w-md mx-auto">
          Explore all available positions and find your perfect role
        </p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white rounded-lg font-medium shadow-lg shadow-[#1E40AF]/20 transition-all hover:shadow-xl"
        >
          Browse All Jobs
          <TrendingUp className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
