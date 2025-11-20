"use client";

import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#0a0e27]">
      <div className="absolute inset-0 bg-linear-to-br from-[#0a0e27] via-[#10B981]/20 to-[#0a0e27]"></div>
      <div className="absolute inset-0 bg-linear-to-tr from-[#3B82F6]/10 via-transparent to-[#10B981]/10"></div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#34D399]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          <NewVerificationForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 z-10">
        <div className="max-w-lg space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 backdrop-blur-sm">
            <svg
              className="w-4 h-4 text-[#34D399]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-white">
              Email Verification
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Verifying Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#34D399] to-[#10B981]">
                Account
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              We&apos;re confirming your email address to secure your account.
              This will only take a moment.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <h3 className="text-white font-semibold text-lg">
              What happens next:
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-lg bg-[#10B981]/20">
                  <svg
                    className="w-5 h-5 text-[#34D399]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email Confirmed</h4>
                  <p className="text-sm text-gray-400">
                    Your email address will be verified and activated
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-lg bg-[#10B981]/20">
                  <svg
                    className="w-5 h-5 text-[#34D399]"
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
                </div>
                <div>
                  <h4 className="font-semibold text-white">Account Access</h4>
                  <p className="text-sm text-gray-400">
                    You&apos;ll be able to sign in and access your dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-lg bg-[#10B981]/20">
                  <svg
                    className="w-5 h-5 text-[#34D399]"
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
                  <h4 className="font-semibold text-white">Get Started</h4>
                  <p className="text-sm text-gray-400">
                    Begin using all platform features immediately
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5"
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
                If you didn&apos;t request this verification, you can safely
                ignore this message. The verification link will expire in 1
                hour.
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

export default NewVerificationPage;
