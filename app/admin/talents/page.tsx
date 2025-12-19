import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminTalents } from "@/actions/admin/get-talents";
import { TalentsTable } from "@/components/admin/talents-table";
import { Users } from "lucide-react";

export default async function AdminTalentsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const result = await getAdminTalents();

  if (result.error || !result.success) {
    return <div>Failed to load talents</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-slate-600" />
            Talent Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View, search, and manage all registered talents.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Total: <strong>{result.success.length}</strong>
        </div>
      </div>

      <TalentsTable talents={result.success} />
    </div>
  );
}
