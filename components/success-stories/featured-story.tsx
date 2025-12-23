import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

interface FeaturedStoryProps {
  story: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string | null;
    category: string;
    talent: {
      name: string | null;
      image: string | null;
    } | null;
  };
}

export default function FeaturedStory({ story }: FeaturedStoryProps) {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden mb-16 shadow-2xl group">
      {story.coverImage ? (
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      ) : (
        <div className="w-full h-full bg-slate-800" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start text-white max-w-4xl">
        {/* Badge [cite: 1795] */}
        <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
          <Star className="w-4 h-4 fill-current" />
          Featured Story
        </div>

        <div className="mb-4">
          <h2 className="text-4xl md:text-6xl font-bold font-heading mb-2">
            {story.talent?.name || "Talent Success"}
          </h2>
          <span className="text-amber-400 text-lg md:text-xl font-medium">
            {story.category}
          </span>
        </div>

        <p className="text-xl md:text-2xl text-gray-200 italic mb-8 border-l-4 border-amber-500 pl-4">
          &quot;{story.excerpt}&quot;
        </p>

        <Link
          href={`/success-stories/${story.slug}`}
          className="bg-white text-slate-900 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2"
        >
          Read Story <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
