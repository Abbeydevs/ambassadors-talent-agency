"use client";

import { ResetForm } from "@/components/auth/reset-form";

const ResetPage = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#0a0e27]">
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e27] via-[#1E40AF]/20 to-[#0a0e27]"></div>
      <div className="absolute inset-0 bg-linear-to-tr from-[#3B82F6]/10 via-transparent to-[#1E40AF]/10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E40AF]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#60A5FA]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <ResetForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 z-10">
        <div className="max-w-lg space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E40AF]/20 border border-[#1E40AF]/30 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-[#60A5FA]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm font-medium text-white">
              Secure Recovery
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Reset Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#60A5FA] to-[#3B82F6]">
                Password
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Don&apos;t worry, it happens to the best of us. Enter your email
              and we&apos;ll send you instructions to reset your password.
            </p>
          </div>

          <div className="space-y-4 pt-8">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Check Your Email</h3>
                <p className="text-sm text-gray-400">
                  We&apos;ll send you a secure link to reset your password
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Quick Process</h3>
                <p className="text-sm text-gray-400">
                  Reset your password in just a few minutes
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure & Safe</h3>
                <p className="text-sm text-gray-400">
                  Your account security is our top priority
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

export default ResetPage;
