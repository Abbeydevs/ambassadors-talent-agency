import { getAllJobs } from "@/data/public-jobs";
import { JobFilters } from "@/components/jobs/job-filters";
import { PublicJobCard } from "@/components/jobs/public-job-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JobsSearchInput } from "@/components/employer/job-search-input";
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { db } from "@/lib/db";

interface JobBoardPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    type?: string;
    minSalary?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function JobBoardPage({
  searchParams,
}: JobBoardPageProps) {
  const params = await searchParams;
  const session = await auth();

  let savedJobIds: string[] = [];
  if (session?.user?.id) {
    const profile = await getTalentProfileByUserId(session.user.id);
    if (profile) {
      const saved = await db.savedJob.findMany({
        where: { talentId: profile.id },
        select: { jobId: true },
      });
      savedJobIds = saved.map((s) => s.jobId);
    }
  }

  const filters = {
    query: params.q,
    category: params.category,
    location: params.location,
    type: params.type,
    minSalary: params.minSalary ? Number(params.minSalary) : undefined,
    sort: params.sort,
    page: params.page ? Number(params.page) : 1,
  };

  const { jobs, metadata } = await getAllJobs(filters);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Find Your Next Role
          </h1>
          <div className="max-w-2xl">
            <JobsSearchInput />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <JobFilters />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{jobs.length}</strong> of{" "}
                <strong>{metadata.totalCount}</strong> jobs
              </p>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                <p className="text-lg font-medium text-slate-900">
                  No jobs found
                </p>
                <p className="text-slate-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <PublicJobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                  />
                ))}
              </div>
            )}

            {metadata.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={!metadata.hasPrevPage}
                  asChild={metadata.hasPrevPage}
                >
                  {metadata.hasPrevPage ? (
                    <Link href={`/jobs?page=${metadata.currentPage - 1}`}>
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Link>
                  ) : (
                    <span>
                      <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </span>
                  )}
                </Button>

                <div className="flex items-center px-4 text-sm font-medium">
                  Page {metadata.currentPage} of {metadata.totalPages}
                </div>

                <Button
                  variant="outline"
                  disabled={!metadata.hasNextPage}
                  asChild={metadata.hasNextPage}
                >
                  {metadata.hasNextPage ? (
                    <Link href={`/jobs?page=${metadata.currentPage + 1}`}>
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  ) : (
                    <span>
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
