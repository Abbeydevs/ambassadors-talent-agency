"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  Search,
  MessageSquare,
  Building2,
  Settings,
} from "lucide-react";

const sidebarRoutes = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/employer/dashboard",
  },
  {
    icon: PlusCircle,
    label: "Post a Job",
    href: "/employer/jobs/new",
  },
  {
    icon: Briefcase,
    label: "My Jobs",
    href: "/employer/jobs",
  },
  {
    icon: Users,
    label: "Applications",
    href: "/employer/applications",
  },
  {
    icon: Search,
    label: "Search Talent",
    href: "/employer/search",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/employer/messages",
  },
  {
    icon: Building2,
    label: "Company Profile",
    href: "/employer/settings", // We just built this!
  },
];

export const EmployerSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
      <div className="px-6 py-8 border-b border-slate-800">
        <Link
          href="/employer/dashboard"
          className="flex items-center gap-3 group"
        >
          <div className="h-10 w-10 bg-[#1E40AF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ambassadors</h1>
            <p className="text-xs text-slate-400">Employer Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarRoutes.map((route) => {
          const isActive =
            pathname === route.href || pathname.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all group relative",
                isActive
                  ? "bg-[#1E40AF] text-white shadow-md shadow-blue-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white"
                )}
              />
              <span className="flex-1">{route.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/employer/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
};
