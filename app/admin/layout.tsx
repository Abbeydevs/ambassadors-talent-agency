import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="h-full relative bg-gray-50">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
        <AdminSidebar />
      </div>

      <main className="md:pl-72">
        <AdminHeader /> <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
