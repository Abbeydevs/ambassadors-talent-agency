import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminAnalytics } from "@/actions/admin/analytics";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { getRecentActivity } from "@/actions/admin/get-recent-activity";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/");

  const [analyticsData, activityData] = await Promise.all([
    getAdminAnalytics(),
    getRecentActivity(),
  ]);

  if (!analyticsData) {
    return <div>Failed to load data</div>;
  }

  return (
    <div>
      <AnalyticsDashboard
        data={analyticsData}
        logs={activityData.success || []}
      />
    </div>
  );
}
