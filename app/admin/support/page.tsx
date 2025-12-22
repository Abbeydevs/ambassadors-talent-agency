import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminTickets } from "@/actions/admin/tickets";
import { TicketList } from "@/components/admin/support/ticket-list";

export default async function SupportPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return redirect("/");
  }

  const result = await getAdminTickets();
  const tickets = result.success || [];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Support Center
        </h1>
        <p className="text-slate-500 mt-2">
          View and manage incoming support requests from Talents and Employers.
        </p>
      </div>

      <TicketList tickets={tickets} />
    </div>
  );
}
