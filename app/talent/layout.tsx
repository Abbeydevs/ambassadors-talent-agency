import { Sidebar } from "@/components/talent/layout/sidebar";
import { TopNav } from "@/components/talent/layout/top-nav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TalentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "TALENT") {
    redirect("/");
  }

  return (
    <div className="h-full relative bg-gray-50">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>

      <main className="md:pl-72 min-h-screen">
        <TopNav />
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
