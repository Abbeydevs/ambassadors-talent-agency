import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: Date;
    category: { name: string; slug: string } | null;
    author: { name: string | null; image: string | null };
  };
}

export const BlogCard = ({ post }: BlogPostProps) => {
  return (
    <Link href={`/blog/${post.slug}`} className="group h-full">
      <Card className="h-full overflow-hidden border-none shadow-md transition-all hover:shadow-xl flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
              No Image
            </div>
          )}
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            {post.category && (
              <Badge variant="secondary" className="font-normal">
                {post.category.name}
              </Badge>
            )}
            <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
          </div>

          <h3 className="line-clamp-2 text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="p-4 pt-0 grow">
          <p className="line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.image || ""} />
            <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-slate-700">
            {post.author.name}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
