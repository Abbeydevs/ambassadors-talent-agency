/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import { getTalentDashboardStats } from "@/data/talent-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  Bookmark,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function TalentDashboard() {
  const session = await auth();

  if (!session?.user?.id) return redirect("/auth/login");

  const stats = await getTalentDashboardStats(session.user.id);

  const completionScore = stats?.completionScore || 0;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-linear-to-br from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] p-8 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[20px_20px]"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-white/80 text-sm font-medium">
                  Welcome back
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {session.user.name}!
              </h1>
              <p className="text-white/80 text-sm">
                Here&apos;s what&apos;s happening with your career today
              </p>
            </div>

            <div className="w-full md:w-80 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold text-sm">
                  Profile Completion
                </span>
                <span className="text-white font-bold text-lg">
                  {completionScore}%
                </span>
              </div>
              <Progress value={completionScore} className="h-2 bg-white/20" />
              <Link
                href="/talent/profile/edit/personal"
                className="text-xs text-white hover:text-white/80 flex items-center gap-1 mt-3 group"
              >
                {completionScore < 100
                  ? "Complete your profile"
                  : "Update profile"}
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Applications"
          value={stats?.applicationsCount || 0}
          subtext="Jobs applied to"
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Saved Jobs"
          value={stats?.savedJobsCount || 0}
          subtext="Bookmarked for later"
          icon={Bookmark}
          color="amber"
        />
        <StatsCard
          title="Enrolled Courses"
          value={stats?.enrollmentsCount || 0}
          subtext="Active learning"
          icon={GraduationCap}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionButton
            label="Browse Jobs"
            href="/jobs"
            primary
            icon={Briefcase}
          />
          <QuickActionButton
            label="Update Profile"
            href="/talent/profile/edit/personal"
            icon={Star}
          />
          <QuickActionButton
            label="My Applications"
            href="/talent/applications"
            icon={TrendingUp}
          />
          <QuickActionButton
            label="Saved Jobs"
            href="/talent/saved-jobs"
            icon={Bookmark}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h3>
            <Link href="/talent/applications">
              <Button
                variant="link"
                className="text-[#1E40AF] px-0 hover:text-[#1E40AF]/80"
              >
                View All →
              </Button>
            </Link>
          </div>

          {!stats?.recentApplications ||
          stats.recentApplications.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-full">
                    <Briefcase className="h-8 w-8 text-[#1E40AF]" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 text-lg">
                      No applications yet
                    </p>
                    <p className="text-sm text-gray-500 max-w-sm">
                      Start applying to jobs that match your skills and see them
                      here.
                    </p>
                  </div>
                  <Link href="/jobs">
                    <Button className="mt-2 bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                      Find Opportunities
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {stats.recentApplications.map((app) => (
                <Card
                  key={app.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center border text-slate-400">
                        {app.job.employer.companyLogoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={app.job.employer.companyLogoUrl}
                            alt="Logo"
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {app.job.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {app.job.employer.companyName}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {app.job.location}
                          </span>
                          <span>•</span>
                          <span>
                            Applied {format(new Date(app.createdAt), "MMM d")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace("_", " ")}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recommended</h3>
          </div>

          <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-white/10 rounded-lg w-fit">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Boost Your Profile</h4>
                <p className="text-slate-300 text-sm mt-1">
                  Talents with verified profiles get 5x more job offers.
                </p>
              </div>
              <Button variant="secondary" className="w-full">
                Get Verified
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Did you know?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Adding a video reel to your portfolio increases your chances of
                getting shortlisted by 80%.
              </p>
              <Link
                href="/talent/profile/edit/media"
                className="text-sm text-[#1E40AF] font-medium hover:underline"
              >
                Upload Video →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "HIRED":
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    case "INTERVIEW":
      return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
    case "REJECTED":
      return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
    case "SHORTLISTED":
      return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    default:
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"; // SUBMITTED/PENDING
  }
}

function StatsCard({ title, value, subtext, icon: Icon, color }: any) {
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
            } bg-opacity-10`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
          </div>
          <p className="text-xs text-gray-500">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({ label, href, primary, icon: Icon }: any) {
  return (
    <Button
      asChild
      variant={primary ? "default" : "outline"}
      className={`h-auto py-6 flex flex-col gap-2 transition-all hover:scale-105 ${
        primary
          ? "bg-linear-to-br from-[#1E40AF] to-[#3B82F6] hover:from-[#1E40AF]/90 hover:to-[#3B82F6]/90 shadow-lg"
          : "bg-white hover:bg-gray-50 border-2"
      }`}
    >
      <Link href={href}>
        {Icon && <Icon className="h-5 w-5" />}
        <span className="font-medium text-sm">{label}</span>
      </Link>
    </Button>
  );
}
