/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import { getEmployerProfileByUserId } from "@/data/employer-profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  Users,
  UserCheck,
  PlusCircle,
  Search,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default async function EmployerDashboard() {
  const session = await auth();
  const profile = await getEmployerProfileByUserId(session?.user?.id || "");

  const isVerified = !!profile?.user?.companyName;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-white/80 text-sm font-medium">
                  Welcome back
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {session?.user?.companyName || session?.user?.name}!
              </h1>
              <p className="text-white/80">
                Manage your jobs and applicants from one place
              </p>
            </div>

            {isVerified ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-white/30 text-white rounded-full text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Verified Company
              </div>
            ) : (
              <Button
                asChild
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
              >
                <Link href="/employer/settings">
                  <AlertCircle className="h-4 w-4 mr-2" /> Complete Verification
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Jobs"
          value="0"
          icon={Briefcase}
          color="blue"
        />
        <StatsCard title="Applications" value="0" icon={Users} color="purple" />
        <StatsCard
          title="Shortlisted"
          value="0"
          icon={UserCheck}
          color="amber"
        />
        <StatsCard
          title="Hires Made"
          value="0"
          icon={Building2}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-dashed border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group">
          <Link href="/employer/jobs/new">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-linear-to-br from-blue-500 to-indigo-500 text-white rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <PlusCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Post a New Job
              </h3>
              <p className="text-sm text-gray-600">
                Create a new listing to find perfect talent
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-2 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
          <Link href="/employer/search">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-linear-to-br from-purple-100 to-pink-100 text-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search Talent
              </h3>
              <p className="text-sm text-gray-600">
                Browse verified professionals
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-2 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
          <Link href="/employer/settings">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-linear-to-br from-gray-100 to-slate-100 text-gray-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Company Profile
              </h3>
              <p className="text-sm text-gray-600">Update your brand details</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h3>
            <Button
              variant="link"
              className="text-[#1E40AF] px-0 hover:text-[#1E40AF]/80"
            >
              View All →
            </Button>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-full">
                  <Users className="h-8 w-8 text-[#1E40AF]" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-lg">
                    No applications yet
                  </p>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Post a job to start receiving applications from top talent
                  </p>
                </div>
                <Button
                  asChild
                  className="mt-2 bg-[#1E40AF] hover:bg-[#1E40AF]/90"
                >
                  <Link href="/employer/jobs/new">
                    Post Your First Job
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Jobs Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
            <Button
              variant="link"
              className="text-[#1E40AF] px-0 hover:text-[#1E40AF]/80"
            >
              View All →
            </Button>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="py-12 px-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200 mb-3">
                <Briefcase className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No active jobs
              </p>
              <p className="text-xs text-gray-500">
                Post your first job listing
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div
            className={`p-2 rounded-lg bg-linear-to-br ${
              colorClasses[color] || colorClasses.blue
            }`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
          </div>
          <p className="text-xs text-gray-500">Total count</p>
        </div>
      </CardContent>
    </Card>
  );
}
