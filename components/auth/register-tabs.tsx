"use client";

import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const RegisterTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = pathname?.includes("talent") ? "talent" : "employer";

  const handleTabChange = (value: string) => {
    if (value === "talent") {
      router.push("/auth/register/talent");
    } else {
      router.push("/auth/register/employer");
    }
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="w-full cursor-pointer"
    >
      <TabsList className="grid w-full grid-cols-2 h-12 bg-white/5 backdrop-blur-sm p-1 border border-white/10">
        <TabsTrigger
          value="talent"
          className="cursor-pointer data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 font-medium transition-all duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Join as Talent
        </TabsTrigger>
        <TabsTrigger
          value="employer"
          className="cursor-pointer data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 font-medium transition-all duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Hire Talent
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
