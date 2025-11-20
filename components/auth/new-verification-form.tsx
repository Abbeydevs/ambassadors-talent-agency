"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>(
    !token ? "Missing token!" : undefined
  );
  const [success, setSuccess] = useState<string | undefined>();

  const hasMounted = useRef(false);

  useEffect(() => {
    if (success || error || !token) return;

    if (hasMounted.current) return;
    hasMounted.current = true;

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="space-y-3 mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Email Verification
          </h1>
          <p className="text-gray-300">
            We&apos;re confirming your email address
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {!success && !error && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#10B981]/20 border-t-[#10B981] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#34D399]"
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
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-white">
                  Verifying your email...
                </p>
                <p className="text-sm text-gray-400">
                  This will only take a moment
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center animate-in zoom-in duration-500">
                <svg
                  className="w-12 h-12 text-[#10B981]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-sm p-4 rounded-lg flex items-start gap-3 w-full animate-in slide-in-from-top-2 duration-300">
                <svg
                  className="w-5 h-5 text-green-300 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-green-200">
                    Success!
                  </p>
                  <p className="text-sm text-green-200">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-in zoom-in duration-500">
                <svg
                  className="w-12 h-12 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-sm p-4 rounded-lg flex items-start gap-3 w-full animate-in slide-in-from-top-2 duration-300">
                <svg
                  className="w-5 h-5 text-red-300 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-red-200">
                    Verification Failed
                  </p>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {(success || error) && (
          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full h-11 bg-linear-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E40AF]/90 hover:to-[#3B82F6]/90 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#1E40AF]/50 hover:scale-[1.02] active:scale-[0.98]">
                Continue to Login
              </Button>
            </Link>
            {error && (
              <Link href="/auth/register/talent" className="block">
                <Button
                  variant="outline"
                  className="w-full h-11 bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  Create New Account
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-2">
            <svg
              className="w-6 h-6 text-red-400"
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
          </div>
          <h3 className="text-white font-semibold">Need Assistance?</h3>
          <p className="text-sm text-gray-400">
            If you continue to experience issues with email verification, please
            contact our support team for help.
          </p>
          <Button
            variant="link"
            className="text-[#60A5FA] hover:text-[#3B82F6] p-0 h-auto"
            asChild
          >
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      )}

      {success && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#10B981]/20 mb-2">
            <svg
              className="w-6 h-6 text-[#10B981]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-white font-semibold">You&apos;re All Set!</h3>
          <p className="text-sm text-gray-400">
            Your account is now verified and ready to use. Sign in to start
            exploring all the features.
          </p>
        </div>
      )}
    </div>
  );
};
