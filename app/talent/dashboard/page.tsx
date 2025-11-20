import { auth } from "@/auth";
import { UserButton } from "@/components/auth/user-button";

const TalentDashboard = async () => {
  const session = await auth();

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Talent Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {session?.user?.email}
          </span>
          <UserButton />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="text-2xl font-bold">+0</div>
          <p className="text-xs text-muted-foreground">Profile Views</p>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
