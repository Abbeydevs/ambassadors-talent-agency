import { auth } from "@/auth";
import { UserButton } from "@/components/auth/user-button";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-x-4">
          <span className="text-sm text-muted-foreground">
            Logged in as {session.user.name}
          </span>
          <UserButton />
        </div>
      </div>

      <div className="p-4 border rounded-md bg-slate-50">
        <p>
          <strong>User ID:</strong> {session.user.id}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        <p>
          <strong>Role:</strong> {session.user.role}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
