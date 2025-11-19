"use client";

import { RegisterForm } from "@/components/auth/register-form";

const EmployerRegisterPage = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#0a0e27]">
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e27] via-[#1E40AF]/20 to-[#0a0e27]"></div>
      <div className="absolute inset-0 bg-linear-to-tr from-[#3B82F6]/10 via-transparent to-[#1E40AF]/10"></div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E40AF]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#60A5FA]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <RegisterForm role="EMPLOYER" />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 z-10">
        <div className="max-w-lg space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E40AF]/20 border border-[#1E40AF]/30 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-[#60A5FA]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-white">
              Premier Talent Agency
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Discover{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#60A5FA] to-[#3B82F6]">
                Exceptional
              </span>{" "}
              Talent
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              We represent the finest actors, musicians, dancers, and
              entertainers. Bringing your vision to life with world-class
              professionals.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">
                Talented Professionals
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">5K+</div>
              <div className="text-sm text-gray-400">Successful Projects</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-400">Client Satisfaction</div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 rounded-lg bg-[#1E40AF]/20">
                <svg
                  className="w-5 h-5 text-[#60A5FA]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Verified Professionals
                </h3>
                <p className="text-sm text-gray-400">
                  All talents are thoroughly vetted and verified
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 rounded-lg bg-[#1E40AF]/20">
                <svg
                  className="w-5 h-5 text-[#60A5FA]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Quick Hiring Process
                </h3>
                <p className="text-sm text-gray-400">
                  Find and hire talent in as little as 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default EmployerRegisterPage;
