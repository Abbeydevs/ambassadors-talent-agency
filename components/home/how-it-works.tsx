"use client";

import {
  UserPlus,
  Search,
  Briefcase,
  CheckCircle,
  Users,
  ArrowRight,
} from "lucide-react";

export function HowItWorks() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-linear-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-sm font-semibold text-blue-900">
              Simple & Secure Process
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Whether you&apos;re looking to get hired or looking for talent, we
            make the process simple and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative max-w-6xl mx-auto">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-gray-200 to-transparent -translate-x-1/2"></div>

          {/* For Talents */}
          <div className="space-y-6 sm:space-y-8">
            {/* Header Card */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-md">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold tracking-wider uppercase text-xs mb-3">
                For Talents
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                Get Discovered
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </h3>
            </div>

            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                    1. Create Your Profile
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Build a professional portfolio showcasing your skills,
                    photos, videos, and experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                    2. Browse Opportunities
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Filter jobs by category, location, and project type to find
                    your perfect match.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                    3. Apply & Get Hired
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Submit applications directly, chat with employers, and
                    manage your bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Employers */}
          <div className="space-y-6 sm:space-y-8">
            {/* Header Card */}
            <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-md">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold tracking-wider uppercase text-xs mb-3">
                For Employers
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                Find Perfect Talent
                <ArrowRight className="w-5 h-5 text-amber-600" />
              </h3>
            </div>

            {/* Step 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-lg transition-all">
              <div className="flex gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                    1. Post a Job
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Describe your project, roles, and requirements to attract
                    top-tier talent.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-lg transition-all">
              <div className="flex gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                    2. Review Applications
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Screen profiles, watch showreels, view resumes, and
                    shortlist candidates.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-lg transition-all">
              <div className="flex gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl mb-2 text-gray-900">
                    3. Hire the Best
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Connect with talent, schedule auditions, and launch your
                    project successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
