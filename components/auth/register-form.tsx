"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { register } from "@/actions/register";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RegisterTabs } from "@/components/auth/register-tabs";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  role: "TALENT" | "EMPLOYER";
}

export const RegisterForm = ({ role }: RegisterFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: role,
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          router.push(
            `/auth/login?success=${encodeURIComponent(data.success)}`
          );
        }
      });
    });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8">
          <RegisterTabs />
        </div>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {role === "TALENT" ? "Join as Talent" : "Hire Creative Talent"}
          </h1>
          <p className="text-gray-300">
            {role === "TALENT"
              ? "Create your profile and get discovered by top employers"
              : "Find and hire the best creative professionals"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-[#60A5FA] transition-all duration-200 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-[#60A5FA] transition-all duration-200 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="••••••••"
                        type="password"
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-[#60A5FA] transition-all duration-200 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-sm p-4 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
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
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-sm p-4 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
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
                <p className="text-sm text-green-200">{success}</p>
              </div>
            )}

            <Button
              disabled={isPending}
              type="submit"
              className="w-full h-11 bg-linear-to-r from-[#1E40AF] to-[#3B82F6] hover:from-[#1E40AF]/90 hover:to-[#3B82F6]/90 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#1E40AF]/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-gray-400">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="text-[#60A5FA] hover:text-[#3B82F6] hover:underline font-medium transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#60A5FA] hover:text-[#3B82F6] hover:underline font-medium transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </form>
        </Form>

        <div className="pt-6 mt-6 border-t border-white/10">
          <p className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#60A5FA] hover:text-[#3B82F6] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
