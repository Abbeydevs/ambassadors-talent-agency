"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  User,
  Ruler,
  Briefcase,
  Image as ImageIcon,
  FileText,
  Settings,
} from "lucide-react";

const items = [
  {
    title: "Personal Information",
    href: "/talent/profile/edit/personal",
    icon: User,
  },
  {
    title: "Physical Attributes",
    href: "/talent/profile/edit/physical",
    icon: Ruler,
  },
  {
    title: "Professional Details",
    href: "/talent/profile/edit/professional",
    icon: Briefcase,
  },
  {
    title: "Portfolio & Media",
    href: "/talent/profile/edit/media",
    icon: ImageIcon,
  },
  {
    title: "Experience & Credits",
    href: "/talent/profile/edit/experience",
    icon: FileText,
  },
  {
    title: "Profile Settings",
    href: "/talent/profile/edit/settings",
    icon: Settings,
  },
];

export function ProfileSidebarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-[#1E40AF]/10 text-[#1E40AF] hover:bg-[#1E40AF]/20"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
