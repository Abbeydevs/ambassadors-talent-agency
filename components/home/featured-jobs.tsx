import Link from "next/link";
import { getAllJobs } from "@/data/public-jobs";
import { PublicJobCard } from "@/components/jobs/public-job-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

export async function FeaturedJobsSection() {
  const { jobs } = await getAllJobs({ page: 1 });
  const recentJobs = jobs.slice(0, 3);

  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] mb-4">
              <Briefcase className="w-4 h-4 text-[#1E40AF]" />
              <span className="text-xs font-semibold text-[#1E40AF]">
                Latest Postings
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
              Latest Opportunities
            </h2>
            <p className="text-[#6B7280] text-lg">
              Discover roles that match your skills. From blockbuster movies to
              commercial shoots.
            </p>
          </div>
          <Link href="/jobs" className="hidden md:block">
            <Button
              variant="ghost"
              className="text-[#1E40AF] hover:text-[#1E3A8A] hover:bg-[#EFF6FF] font-semibold group border border-transparent hover:border-[#DBEAFE]"
            >
              View All Jobs{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB]">
            <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              No jobs posted yet
            </h3>
            <p className="text-[#6B7280]">
              Check back soon for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <div key={job.id} className="h-full">
                <PublicJobCard job={job} isSaved={false} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link href="/jobs">
            <Button className="bg-[#1E40AF] hover:bg-[#1E3A8A] w-full font-semibold">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
