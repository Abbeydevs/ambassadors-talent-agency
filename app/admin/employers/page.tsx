import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminEmployers } from "@/actions/admin/get-employers";
import { EmployersTable } from "@/components/admin/employers-table";
import { Building2 } from "lucide-react";

export default async function AdminEmployersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const result = await getAdminEmployers();

  if (result.error || !result.success) {
    return <div>Failed to load employers</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-slate-600" />
            Employer Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Verify and manage company accounts.
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Total: <strong>{result.success.length}</strong>
        </div>
      </div>

      <EmployersTable employers={result.success} />
    </div>
  );
}
