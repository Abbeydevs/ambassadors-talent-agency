import { EmployerSidebar } from "@/components/employer/layout/sidebar";
import { TopNav } from "@/components/talent/layout/top-nav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "EMPLOYER") {
    redirect("/");
  }

  return (
    <div className="h-full relative bg-slate-50">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <EmployerSidebar />
      </div>

      {/* Main Content Area */}
      <main className="md:pl-72 min-h-screen flex flex-col">
        <TopNav />
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
