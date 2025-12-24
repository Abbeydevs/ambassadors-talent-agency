import { UserPlus, Search, Briefcase, CheckCircle, Users } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Whether you are looking to get hired or looking for talent, we make
            the process simple and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative">
          {/* Vertical Divider (Desktop Only) */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-slate-200 -translate-x-1/2"></div>

          {/* For Talents */}
          <div className="space-y-10">
            <div className="text-center lg:text-left">
              <span className="text-[#1E40AF] font-bold tracking-wider uppercase text-sm">
                For Talents
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Get Discovered
              </h3>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                <UserPlus className="w-6 h-6 text-[#1E40AF]" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">
                  1. Create Your Profile
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Build a professional portfolio showcasing your skills, photos,
                  videos, and experience.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                <Search className="w-6 h-6 text-[#1E40AF]" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">
                  2. Browse Opportunities
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Filter jobs by category, location, and project type to find
                  your perfect match.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                <CheckCircle className="w-6 h-6 text-[#1E40AF]" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">3. Apply & Get Hired</h4>
                <p className="text-slate-600 leading-relaxed">
                  Submit applications directly, chat with employers, and manage
                  your bookings.
                </p>
              </div>
            </div>
          </div>

          {/* For Employers */}
          <div className="space-y-10">
            <div className="text-center lg:text-left">
              <span className="text-amber-600 font-bold tracking-wider uppercase text-sm">
                For Employers
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Find Perfect Talent
              </h3>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                <Briefcase className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">1. Post a Job</h4>
                <p className="text-slate-600 leading-relaxed">
                  Describe your project, roles, and requirements to attract
                  top-tier talent.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">
                  2. Review Applications
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Screen profiles, watch showreels, view resumes, and shortlist
                  candidates.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">3. Hire the Best</h4>
                <p className="text-slate-600 leading-relaxed">
                  Connect with talent, schedule auditions, and launch your
                  project successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
