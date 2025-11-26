import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { db } from "@/lib/db";
import { PublicJobCard } from "@/components/jobs/public-job-card";
import { redirect } from "next/navigation";

export default async function SavedJobsPage() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");

  if (!profile) return redirect("/");

  const savedJobs = await db.savedJob.findMany({
    where: { talentId: profile.id },
    include: {
      job: {
        include: {
          employer: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Saved Jobs</h2>
        <p className="text-muted-foreground">
          Jobs you have bookmarked for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-slate-50">
          <p className="text-slate-500">You haven&apos;t saved any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl">
          {savedJobs.map((saved) => (
            <PublicJobCard key={saved.id} job={saved.job} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
}
