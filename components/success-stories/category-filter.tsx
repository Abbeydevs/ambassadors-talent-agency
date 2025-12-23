"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Actor",
  "Model",
  "Dancer",
  "Musician",
  "Comedian",
  "Presenter",
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/success-stories?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
            currentCategory === cat
              ? "bg-slate-900 text-white border-slate-900 shadow-md"
              : "bg-white text-slate-600 border-gray-200 hover:border-slate-400 hover:bg-slate-50"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
