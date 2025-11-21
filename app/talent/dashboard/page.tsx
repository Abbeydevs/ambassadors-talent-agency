/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/auth";
import { getTalentProfileByUserId } from "@/data/talent-profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Eye,
  TrendingUp,
  Bookmark,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function TalentDashboard() {
  const session = await auth();
  const profile = await getTalentProfileByUserId(session?.user?.id || "");
  const completionScore = profile?.profileCompletion || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
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
                {session?.user?.name}!
              </h1>
              <p className="text-white/80 text-sm">
                Here&apos;s what&apos;s happening with your profile today
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Profile Views"
          value="128"
          subtext="This Month"
          icon={Eye}
          trend="+12%"
          color="blue"
        />
        <StatsCard
          title="Applications"
          value="0"
          subtext="Total Active"
          icon={Briefcase}
          color="purple"
        />
        <StatsCard
          title="Saved Jobs"
          value="0"
          subtext="To Apply"
          icon={Bookmark}
          color="amber"
        />
        <StatsCard
          title="Courses"
          value="0"
          subtext="In Progress"
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
            href="#"
            primary
            icon={Briefcase}
          />
          <QuickActionButton
            label="Update Profile"
            href="/talent/profile/edit/personal"
            icon={Star}
          />
          <QuickActionButton
            label="Explore Courses"
            href="#"
            icon={GraduationCap}
          />
          <QuickActionButton
            label="Messages"
            href="/talent/messages"
            icon={Eye}
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
                <Button className="mt-2 bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Find Opportunities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recommended</h3>
            <Button
              variant="link"
              className="text-[#1E40AF] px-0 hover:text-[#1E40AF]/80"
            >
              View All →
            </Button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Lead Actor for Commercial",
                company: "Netflix Studios",
                location: "Lagos",
                salary: "₦150k - ₦200k",
                type: "Full-time",
                featured: true,
              },
              {
                title: "Voice Over Artist",
                company: "Spotify Africa",
                location: "Remote",
                salary: "₦80k - ₦120k",
                type: "Contract",
                featured: false,
              },
              {
                title: "Brand Ambassador",
                company: "Coca-Cola Nigeria",
                location: "Abuja",
                salary: "₦100k - ₦150k",
                type: "Part-time",
                featured: false,
              },
            ].map((job, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-all cursor-pointer border-0 shadow-md group"
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#1E40AF] transition-colors">
                      {job.title}
                    </h4>
                    {job.featured && (
                      <Badge className="bg-linear-to-r from-[#F59E0B] to-[#EF4444] text-white text-[10px] border-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-gray-600 font-medium">
                      {job.company}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs font-semibold text-[#1E40AF]">
                      {job.salary}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {job.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, subtext, icon: Icon, trend, color }: any) {
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
            {trend && (
              <span className="text-xs text-green-600 font-semibold flex items-center bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> {trend}
              </span>
            )}
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
