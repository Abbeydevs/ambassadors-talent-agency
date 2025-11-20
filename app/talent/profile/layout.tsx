import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TalentProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "TALENT") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
