import { auth } from "@/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="p-4 border rounded-md bg-slate-50">
        <p>
          <strong>User:</strong> {session.user?.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user?.email}
        </p>
        <p>
          <strong>Role:</strong> {session.user?.role}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
