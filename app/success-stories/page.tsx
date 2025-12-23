import { getAllSuccessStories, getFeaturedStory } from "@/data/success-stories";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CategoryFilter from "@/components/success-stories/category-filter";
import FeaturedStory from "@/components/success-stories/featured-story";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessStoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;

  const [stories, featuredStory] = await Promise.all([
    getAllSuccessStories(category),
    !category ? getFeaturedStory() : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-slate-50 border-b border-gray-200 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-heading">
            Success Stories
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Be inspired by our community&apos;s achievements
          </p>
          <CategoryFilter />
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12">
        {featuredStory && !category && <FeaturedStory story={featuredStory} />}
        {!stories || stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No success stories found for
              <span className="font-bold text-slate-900">
                {" "}
                &quot;{category || "this category"}&quot;
              </span>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => {
              if (featuredStory && story.id === featuredStory.id && !category) {
                return null;
              }

              return (
                <Link
                  href={`/success-stories/${story.slug}`}
                  key={story.id}
                  className="group block h-full"
                >
                  <div className="relative overflow-hidden rounded-xl h-[400px] w-full shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                      <div className="relative w-full h-full">
                        {story.coverImage ? (
                          <Image
                            src={story.coverImage}
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-400">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                    </div>

                    {/* Card Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                      <span className="inline-block px-3 py-1 bg-amber-500 text-xs font-bold uppercase tracking-wider rounded-full mb-3 text-white">
                        {story.category}
                      </span>

                      <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                        {story.title}
                      </h3>

                      <p className="text-gray-200 italic mb-4 line-clamp-2">
                        &quot;{story.excerpt}&quot;
                      </p>

                      <div className="flex items-center text-sm font-semibold text-amber-400">
                        Read Full Story{" "}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
