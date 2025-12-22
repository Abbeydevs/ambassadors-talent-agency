"use client";

import * as React from "react";
import {
  Download,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { RecentActivityList } from "@/components/admin/recent-activity-list";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserGrowthItem {
  name: string;
  users: number;
}

interface RevenueItem {
  name: string;
  revenue: number;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: Date;
  actor: { name: string | null; image: string | null };
  targetUser: {
    name: string | null;
    email: string | null;
    companyName: string | null;
  } | null;
}

interface AnalyticsDashboardProps {
  data: {
    stats: {
      totalUsers: number;
      totalJobs: number;
      activeJobs: number;
      revenue: string;
    };
    charts: {
      userGrowth: UserGrowthItem[];
      revenue: RevenueItem[];
    };
  };
  logs: ActivityLog[];
}

export const AnalyticsDashboard = ({ data, logs }: AnalyticsDashboardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState("Last 6 months");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const timeRanges = [
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "Last 6 months", value: "6m" },
    { label: "Last year", value: "1y" },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your platform&apos;s performance and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{selectedRange}</span>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setSelectedRange(range.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedRange === range.label
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              +20.1%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {data.stats.totalUsers.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">from last month</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              +12 new
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Active Jobs
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {data.stats.activeJobs.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">since last week</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              +15%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {data.stats.revenue}
          </p>
          <p className="text-xs text-gray-500 mt-2">from last month</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Growth Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">+12.5%</p>
          <p className="text-xs text-gray-500 mt-2">overall platform growth</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                User Growth
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Monthly user registration trends
              </p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.userGrowth}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#1E40AF"
                    strokeWidth={3}
                    dot={{ fill: "#1E40AF", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Monthly revenue performance
              </p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.revenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `₦${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "#F9FAFB" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number | undefined) => [
                      `₦${(value || 0).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <RecentActivityList logs={logs} />
        </div>
      </div>
    </div>
  );
};
