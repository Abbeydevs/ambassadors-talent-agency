import { getJobById } from "@/data/public-jobs";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

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

  const isTalent = session?.user?.role === "TALENT";

  return <JobDetailView job={job} isTalent={isTalent} />;
}
