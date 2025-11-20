import { UserButton } from "@/components/auth/user-button";

const AdminDashboard = async () => {
  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Panel
        </h1>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
            ADMIN
          </span>
          <UserButton />
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">System Overview</h2>
        <p>Welcome to the secure admin area.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
