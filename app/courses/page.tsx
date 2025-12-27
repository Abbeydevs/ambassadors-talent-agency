/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sparkles,
  Video,
  Users,
  Award,
  ArrowRight,
} from "lucide-react";

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#0a0e27] py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-[#1E40AF]/20 via-transparent to-[#F59E0B]/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E40AF]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F59E0B]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm">
            Coming Soon
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Ambassador <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#60A5FA] to-[#3B82F6]">
              Academy
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate learning platform for African creatives. Master your
            craft with world-class courses taught by industry legends.
          </p>

          {/* Email Signup Form (Visual Only for now) */}
          <div className="max-w-md mx-auto bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-sm flex items-center mb-12">
            <Input
              placeholder="Enter your email for updates..."
              className="bg-transparent border-none text-white placeholder:text-slate-400 focus-visible:ring-0 h-12 px-6"
            />
            <Button className="rounded-full bg-[#1E40AF] hover:bg-[#1E40AF]/90 h-10 px-6">
              Notify Me
            </Button>
          </div>

          {/* Feature Teasers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <FeatureCard
              icon={Video}
              title="Masterclasses"
              desc="High-quality video lessons from top actors, models, and directors."
            />
            <FeatureCard
              icon={Users}
              title="Live Workshops"
              desc="Interactive sessions to practice your skills and get feedback."
            />
            <FeatureCard
              icon={Award}
              title="Certification"
              desc="Earn verified badges to boost your profile and get hired faster."
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 mb-4">
            While you wait, why not explore current opportunities?
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/jobs">
              <Button variant="outline" size="lg">
                Find Jobs
              </Button>
            </Link>
            <Link href="/talents">
              <Button variant="ghost" size="lg" className="text-[#1E40AF]">
                Browse Talent <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
      <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
