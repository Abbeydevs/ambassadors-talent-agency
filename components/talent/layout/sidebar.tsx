"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Bookmark,
  GraduationCap,
  MessageSquare,
  Settings,
  HelpCircle,
} from "lucide-react";

const sidebarRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/talent/dashboard",
  },
  {
    icon: FolderOpen,
    label: "My Applications",
    href: "/talent/applications",
  },
  {
    icon: Bookmark,
    label: "Saved Jobs",
    href: "/talent/saved-jobs",
  },
  {
    icon: GraduationCap,
    label: "My Courses",
    href: "/talent/courses",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/talent/messages",
  },
  {
    icon: Settings,
    label: "Profile Settings",
    href: "/talent/profile/edit/personal",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "/talent/support",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r shadow-sm">
      <div className="px-6 py-8 border-b">
        <Link
          href="/talent/dashboard"
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="h-10 w-10 bg-linear-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 group-hover:text-[#1E40AF] transition-colors">
              Ambassadors
            </h1>
            <p className="text-xs text-gray-500">Talent Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarRoutes.map((route) => {
          const isActive =
            pathname === route.href ||
            (pathname.startsWith(route.href) &&
              route.href !== "/talent/dashboard");

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all group relative",
                isActive
                  ? "bg-linear-to-r from-[#1E40AF]/10 to-[#3B82F6]/10 text-[#1E40AF] shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-[#1E40AF] to-[#3B82F6] rounded-r-full"></div>
              )}
              <div
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isActive
                    ? "bg-linear-to-br from-[#1E40AF] to-[#3B82F6] text-white shadow-md"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                )}
              >
                <route.icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{route.label}</span>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-[#1E40AF] animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <div className="bg-linear-to-br from-[#1E40AF]/10 to-[#3B82F6]/10 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-linear-to-br from-[#F59E0B] to-[#EF4444] rounded-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-900">
              Upgrade Skills
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Take courses to boost your profile visibility
          </p>
          <button className="w-full bg-linear-to-r from-[#1E40AF] to-[#3B82F6] text-white text-xs font-medium py-2 px-3 rounded-lg hover:shadow-lg transition-shadow">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
};
