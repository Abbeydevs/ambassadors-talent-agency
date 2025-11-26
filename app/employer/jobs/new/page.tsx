import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Briefcase } from "lucide-react";
import { CreateJobForm } from "@/components/employer/create-job-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PostJobPage() {
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id) {
    return redirect("/");
  }

  const profile = await getEmployerProfileByUserId(session.user.id);

  if (!profile?.user?.companyName) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <Card className="max-w-md border-2 border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-linear-to-br from-amber-500 to-orange-500 rounded-full">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Incomplete
              </h2>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                You must complete your Company Profile (specifically the Company
                Name) before you can post jobs.
              </p>
            </div>
            <Button
              asChild
              className="bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-md"
            >
              <Link href="/employer/settings">
                Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-linear-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl">
            Find the perfect talent for your next project. Complete all sections
            to create an attractive job listing.
          </p>
        </div>
      </div>

      <CreateJobForm />
    </div>
  );
}
