"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Users, ArrowRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/jobs");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-50/30 via-white to-white"></div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 hover:border-blue-200 transition-all">
              <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Africa&apos;s #1 Talent Platform
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Discover Africa&apos;s
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-blue-600">Creative Talent</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-center text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Connect with exceptional actors, models, musicians, and voice-over
            artists. Find your dream opportunity or hire world-class talent.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12 px-4">
            <div className="relative bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <Input
                  placeholder="Search for jobs (e.g. Actor, Model)..."
                  className="border-none shadow-none focus-visible:ring-0 text-base h-12 bg-transparent placeholder:text-gray-400 text-gray-900 px-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 h-12 sm:h-14 font-semibold shadow-md hover:shadow-lg transition-all text-base"
                onClick={handleSearch}
              >
                Search Jobs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 px-4">
            <Link href="/auth/register/talent" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all font-semibold rounded-xl"
              >
                Join as Talent
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/register/employer" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-900 hover:text-blue-900 text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 transition-all font-semibold rounded-xl"
              >
                Hire Talent
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-200 hover:shadow-lg transition-all text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                10,000+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">
                Talented Professionals
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-200 hover:shadow-lg transition-all text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                5,000+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">
                Successful Projects
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-blue-200 hover:shadow-lg transition-all text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-4">
                <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                98%
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
