import Link from "next/link";
import Image from "next/image";
import { getAllSuccessStories } from "@/data/success-stories"; // Using your real fetcher
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from "lucide-react";

export async function SuccessStoriesSection() {
  const stories = await getAllSuccessStories();
  const featured = stories.slice(0, 3); // Just show 3

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Making Waves in the Industry
            </h2>
            <p className="text-slate-400 text-lg">
              See how Ambassador Talent Agency is helping creatives land their
              dream roles.
            </p>
          </div>
          <Link href="/success-stories">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              Read All Stories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((story) => (
            <Link
              key={story.id}
              href={`/success-stories/${story.slug}`}
              className="group"
            >
              <div className="relative h-[450px] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-colors">
                <Image
                  src={story.coverImage || "/placeholder-image.jpg"}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <Quote className="w-8 h-8 text-blue-400 mb-4 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />

                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded-full text-white">
                      {story.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors leading-tight">
                    {story.title}
                  </h3>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        {story.talent?.name || "Ambassador Talent"}
                      </span>
                      <span className="text-xs text-slate-400">
                        Featured Talent
                      </span>
                    </div>
                    <div className="ml-auto transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
