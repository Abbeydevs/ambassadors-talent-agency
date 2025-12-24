import Link from "next/link";
import { getAllJobs } from "@/data/public-jobs";
import { PublicJobCard } from "@/components/jobs/public-job-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

export async function FeaturedJobsSection() {
  const { jobs } = await getAllJobs({ page: 1 });
  const recentJobs = jobs.slice(0, 3);

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Latest Opportunities
            </h2>
            <p className="text-slate-600 text-lg">
              Discover roles that match your skills. From blockbuster movies to
              commercial shoots.
            </p>
          </div>
          <Link href="/jobs">
            <Button
              variant="ghost"
              className="text-[#1E40AF] hover:text-[#1E40AF] hover:bg-blue-50 font-semibold group"
            >
              View All Jobs{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              No jobs posted yet
            </h3>
            <p className="text-slate-500">
              Check back soon for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentJobs.map((job) => (
              <div key={job.id} className="h-full">
                <PublicJobCard job={job} isSaved={false} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link href="/jobs">
            <Button className="bg-[#1E40AF] w-full">View All Jobs</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
