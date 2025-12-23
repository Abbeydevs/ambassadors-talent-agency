import { getBlogPost } from "@/actions/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { getComments } from "@/actions/comments";
import { auth } from "@/auth";
import { CommentSection } from "@/components/blog/comment-section";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  const post = data.success;

  if (!post) {
    return notFound();
  }

  const commentsData = await getComments(post.id);
  const comments = commentsData.success || [];

  const session = await auth();
  const currentUser = session?.user
    ? { id: session.user.id!, image: session.user.image }
    : null;

  return (
    <article className="min-h-screen bg-white pb-20">
      <div className="w-full bg-slate-50 border-b">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {post.category.name}
              </Badge>
            )}
            <span className="text-sm text-slate-500">
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 border-t pt-6">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={post.author.image || ""} />
              <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {post.author.name}
              </p>
              <p className="text-xs text-slate-500">{post.author.role}</p>
            </div>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="container mx-auto px-4 max-w-4xl -mt-8 mb-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div
          className="prose prose-lg prose-slate w-full max-w-full wrap-break-word prose-img:rounded-xl prose-img:w-full prose-img:h-auto 
          prose-a:text-blue-600  prose-p:leading-relaxed prose-pre:whitespace-pre-wrap mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-10 border-t">
          <CommentSection
            postId={post.id}
            comments={comments}
            currentUser={currentUser}
          />
        </div>
      </div>
    </article>
  );
}
