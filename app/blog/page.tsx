import { getBlogPosts, getCategories } from "@/actions/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.search || "";
  const categorySlug = resolvedParams.category || "";

  const [postsData, categoriesData] = await Promise.all([
    getBlogPosts(searchTerm, categorySlug),
    getCategories(),
  ]);

  const posts = postsData.success || [];
  const categories = categoriesData.success || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
            The Casting Blog
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Industry news, audition tips, and career advice.
          </p>

          <form className="relative max-w-md mx-auto mb-8">
            {categorySlug && (
              <input type="hidden" name="category" value={categorySlug} />
            )}

            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              name="search"
              defaultValue={searchTerm}
              placeholder="Search articles..."
              className="pl-10 h-12 text-base rounded-full shadow-sm"
            />
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/blog">
              <Button
                variant={categorySlug === "" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                All
              </Button>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}&search=${searchTerm}`}
              >
                <Button
                  variant={categorySlug === cat.slug ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    categorySlug === cat.slug && "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {cat.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">
              No articles found matching your search.
            </p>
            {(searchTerm || categorySlug) && (
              <Link href="/blog">
                <Button variant="link" className="mt-2 text-blue-600">
                  Clear filters
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
