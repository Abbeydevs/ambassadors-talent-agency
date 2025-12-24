"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@/components/auth/user-button";
import { useSession } from "next-auth/react";

const navLinks = [
  { label: "Find Talent", href: "/talents" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Academy", href: "/courses" },
  { label: "Success Stories", href: "/success-stories" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/employer") ||
    (pathname.startsWith("/talent") && !pathname.startsWith("/talents"));

  if (isDashboard) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 bg-linear-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-900 leading-none">
              Ambassador
            </h1>
            <p className="text-xs text-gray-500 font-medium">Talent Agency</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#1E40AF]",
                pathname === link.href ? "text-[#1E40AF]" : "text-gray-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href={
                  session.user.role === "TALENT"
                    ? "/talent/dashboard"
                    : "/employer/dashboard"
                }
              >
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton />
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-[#1E40AF]"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-800 py-2 border-b border-gray-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            {session ? (
              <Link href="/dashboard">
                <Button className="w-full bg-[#1E40AF]">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full bg-[#1E40AF]">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
