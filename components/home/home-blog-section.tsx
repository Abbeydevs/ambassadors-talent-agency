import Link from "next/link";
import { getBlogPosts } from "@/actions/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";

export async function HomeBlogSection() {
  // Fetch latest posts (no search term, no category)
  const { success: posts } = await getBlogPosts();

  // Take only the first 3 posts
  const recentPosts = posts?.slice(0, 3) || [];

  if (recentPosts.length === 0) {
    return null; // Don't show the section if there are no posts
  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 bg-blue-100 rounded-lg">
                <Newspaper className="h-5 w-5 text-blue-600" />
              </span>
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                From the Blog
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Latest Industry Insights
            </h2>
            <p className="text-slate-600 text-lg">
              Expert advice on auditions, casting trends, and career growth for
              talents and employers.
            </p>
          </div>

          <Link href="/blog">
            <Button variant="outline" className="hidden md:flex">
              View All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/blog">
            <Button variant="outline" className="w-full">
              View All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
