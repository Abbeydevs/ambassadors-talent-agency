"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Ruler,
  Briefcase,
  Image as ImageIcon,
  FileText,
  Settings,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const items = [
  {
    title: "Personal Information",
    href: "/talent/profile/edit/personal",
    icon: User,
    description: "Basic details & bio",
    completed: true,
  },
  {
    title: "Physical Attributes",
    href: "/talent/profile/edit/physical",
    icon: Ruler,
    description: "Height, weight, etc.",
    completed: false,
  },
  {
    title: "Professional Details",
    href: "/talent/profile/edit/professional",
    icon: Briefcase,
    description: "Skills & expertise",
    completed: false,
  },
  {
    title: "Portfolio & Media",
    href: "/talent/profile/edit/media",
    icon: ImageIcon,
    description: "Photos & videos",
    completed: false,
  },
  {
    title: "Experience & Credits",
    href: "/talent/profile/edit/experience",
    icon: FileText,
    description: "Work history",
    completed: false,
  },
  {
    title: "Profile Settings",
    href: "/talent/profile/edit/settings",
    icon: Settings,
    description: "Preferences",
    completed: false,
  },
];

export function ProfileSidebarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-all group relative",
              isActive
                ? "bg-linear-to-r from-[#1E40AF]/10 to-[#3B82F6]/10 shadow-sm"
                : "hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isActive
                    ? "bg-linear-to-br from-[#1E40AF] to-[#3B82F6] text-white shadow-md"
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#1E40AF]"
                      : "text-gray-900 group-hover:text-[#1E40AF]"
                  )}
                >
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.completed && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-all",
                  isActive
                    ? "text-[#1E40AF] translate-x-0"
                    : "text-gray-400 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              />
            </div>

            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-[#1E40AF] to-[#3B82F6] rounded-r-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
