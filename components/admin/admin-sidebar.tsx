"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Settings,
  LogOut,
  Headset,
  ShieldAlert,
  AppWindowMac,
  MessageSquare,
  Star,
  Calendar,
} from "lucide-react";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "Talents",
    icon: Users,
    href: "/admin/talents",
  },
  {
    label: "Employers",
    icon: Briefcase,
    href: "/admin/employers",
  },
  {
    label: "Jobs",
    icon: ShieldCheck,
    href: "/admin/jobs",
  },
  {
    icon: AppWindowMac,
    label: "Blog",
    href: "/admin/blog",
  },
  {
    label: "Success Stories",
    icon: Star,
    href: "/admin/success-stories",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    label: "Comments",
    icon: MessageSquare,
    href: "/admin/comments",
  },
  {
    label: "Finance",
    icon: CreditCard,
    href: "/admin/finance",
  },
  {
    label: "Moderation",
    icon: ShieldAlert,
    href: "/admin/moderation",
  },
  {
    label: "Communications",
    icon: Users,
    href: "/admin/communications",
  },
  {
    label: "Support",
    icon: Headset,
    href: "/admin/support",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="px-6 py-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const baseClasses =
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group";
          const activeClasses =
            "bg-blue-600 text-white shadow-lg shadow-blue-600/20";
          const inactiveClasses =
            "text-gray-400 hover:text-white hover:bg-gray-800";

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`}
            >
              <route.icon
                className={`h-5 w-5 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all w-full group"
        >
          <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
