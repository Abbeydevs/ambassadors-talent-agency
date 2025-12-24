"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative w-full h-[650px] flex items-center justify-center bg-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop")',
          opacity: 0.4,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-slate-900/60 to-slate-900 z-0" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
          🚀 The #1 Platform for African Creatives
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Africa&apos;s Premier <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
            Talent Marketplace
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Connect with top-tier actors, models, musicians, and voice-over
          artists. Or find your next big break in the entertainment industry.
        </p>

        <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-2xl flex items-center mb-10 pl-4 pr-2 py-2">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <Input
            placeholder="Search for jobs (e.g. Actor, Model)..."
            className="border-none shadow-none focus-visible:ring-0 text-base h-10 bg-transparent placeholder:text-slate-400"
          />
          <Button className="rounded-full px-8 bg-[#1E40AF] hover:bg-[#1E40AF]/90 h-10">
            Search
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register?role=TALENT">
            <Button
              size="lg"
              className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-lg px-8 py-6 w-full sm:w-auto shadow-lg shadow-blue-900/20"
            >
              Join as Talent
            </Button>
          </Link>
          <Link href="/auth/register?role=EMPLOYER">
            <Button
              size="lg"
              variant="outline"
              className="text-slate-900 bg-white hover:bg-slate-100 border-white text-lg px-8 py-6 w-full sm:w-auto"
            >
              Hire Talent
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
