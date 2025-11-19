"use client";

import { NewPasswordForm } from "@/components/auth/new-password-form";

const NewPasswordPage = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#0a0e27]">
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e27] via-[#1E40AF]/20 to-[#0a0e27]"></div>
      <div className="absolute inset-0 bg-linear-to-tr from-[#3B82F6]/10 via-transparent to-[#1E40AF]/10"></div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E40AF]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#60A5FA]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <NewPasswordForm />
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span className="text-sm font-medium text-white">
              Secure Password Reset
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Create Your New{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#60A5FA] to-[#3B82F6]">
                Password
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Choose a strong password to keep your account secure. Make sure
              it&apos;s something you&apos;ll remember but hard for others to
              guess.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <h3 className="text-white font-semibold text-lg">
              Password Requirements:
            </h3>
            <div className="space-y-3">
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
                  <p className="text-sm text-gray-300">
                    At least 6 characters long
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    Mix of letters, numbers, and symbols
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    Avoid common words or phrases
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#1E40AF]/10 border border-[#1E40AF]/20">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-[#60A5FA] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-gray-300">
                After resetting your password, you&apos;ll be redirected to the
                login page to sign in with your new credentials.
              </p>
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

export default NewPasswordPage;
