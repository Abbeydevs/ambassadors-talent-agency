import {
  UserPlus,
  Search,
  Briefcase,
  CheckCircle,
  Users,
  Globe,
  FileText,
} from "lucide-react";

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">
          How Ambassador Talent Agency Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* For Talents */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">
              For Talents
            </h3>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  1. Create Your Profile
                </h4>
                <p className="text-slate-600">
                  Build a professional portfolio showcasing your skills, photos,
                  and videos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  2. Browse Opportunities
                </h4>
                <p className="text-slate-600">
                  Filter jobs by category, location, and project type to find
                  your perfect match.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">3. Apply & Get Hired</h4>
                <p className="text-slate-600">
                  Submit applications directly and communicate with employers.
                </p>
              </div>
            </div>
          </div>

          {/* For Employers */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-amber-600 mb-6">
              For Employers
            </h3>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">1. Post a Job</h4>
                <p className="text-slate-600">
                  Describe your project and requirements to attract top talent.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  2. Review Applications
                </h4>
                <p className="text-slate-600">
                  Screen profiles, view portfolios, and shortlist candidates.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">3. Hire the Best</h4>
                <p className="text-slate-600">
                  Connect with talent and launch your project successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <Users className="w-10 h-10 mx-auto mb-4 text-blue-400" />
            <h3 className="text-3xl font-bold mb-1">10,000+</h3>
            <p className="text-slate-400">Talents</p>
          </div>
          <div className="p-4">
            <Briefcase className="w-10 h-10 mx-auto mb-4 text-amber-400" />
            <h3 className="text-3xl font-bold mb-1">500+</h3>
            <p className="text-slate-400">Employers</p>
          </div>
          <div className="p-4">
            <FileText className="w-10 h-10 mx-auto mb-4 text-green-400" />
            <h3 className="text-3xl font-bold mb-1">2,000+</h3>
            <p className="text-slate-400">Jobs Posted</p>
          </div>
          <div className="p-4">
            <Globe className="w-10 h-10 mx-auto mb-4 text-purple-400" />
            <h3 className="text-3xl font-bold mb-1">7</h3>
            <p className="text-slate-400">Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}
