import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { VerificationRequestForm } from "@/components/employer/verification-request-form";
import { ShieldCheck } from "lucide-react";

export default async function VerificationPage() {
  const session = await auth();
  if (session?.user?.role !== "EMPLOYER" || !session?.user?.id)
    return redirect("/");

  const profile = await getEmployerProfileByUserId(session.user.id);
  if (!profile) return redirect("/employer/onboarding");

  const currentRequest = await db.verificationRequest.findFirst({
    where: { employerId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-lg">
          <ShieldCheck className="h-8 w-8 text-[#1E40AF]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
            Company Verification
          </h2>
          <p className="text-muted-foreground">
            Get verified to build trust with talents and unlock premium
            features.
          </p>
        </div>
      </div>

      <VerificationRequestForm
        currentRequest={currentRequest}
        isVerified={profile.isVerified}
      />
    </div>
  );
}
