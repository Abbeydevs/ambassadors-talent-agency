import {
  getSuccessStoryBySlug,
  getRelatedStories,
} from "@/data/success-stories";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Share2, ArrowLeft } from "lucide-react";
import SocialShare from "@/components/success-stories/social-share";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SuccessStoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const story = await getSuccessStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = await getRelatedStories(story.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const fullUrl = `${appUrl}/success-stories/${story.slug}`;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative h-[60vh] min-h-[400px] w-full bg-slate-900">
        {story.coverImage && (
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white text-center">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-amber-500 text-sm font-bold uppercase tracking-wider rounded-full mb-6">
              {story.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative w-32 h-32 mb-6">
              <Image
                src={story.talent?.image || "/placeholder-avatar.png"}
                alt={story.talent?.name || "Talent"}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {story.talent?.name}
            </h2>
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {story.createdAt.toLocaleDateString()}
              </span>
              {(story.talent?.talentProfile?.city ||
                story.talent?.talentProfile?.country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {[
                    story.talent.talentProfile.city,
                    story.talent.talentProfile.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </div>
          </div>

          <blockquote className="text-2xl md:text-3xl font-serif text-slate-800 text-center italic leading-relaxed mb-10 border-l-4 border-amber-500 pl-6 md:border-none md:pl-0">
            &quot;{story.excerpt}&quot;
          </blockquote>

          <div className="prose prose-lg prose-slate mx-auto whitespace-pre-wrap">
            {story.content}
          </div>

          <div className="border-t border-slate-100 mt-12 pt-8 flex items-center justify-between">
            <Link
              href="/success-stories"
              className="text-slate-600 hover:text-amber-600 font-medium flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Stories
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-sm font-medium">Share:</span>
              <SocialShare title={story.title} url={fullUrl} />
            </div>
          </div>
        </div>
      </div>

      {relatedStories.length > 0 && (
        <div className="container mx-auto px-4 mt-20 max-w-6xl">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-amber-500 pl-4">
            More Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedStories.map((related) => (
              <Link
                href={`/success-stories/${related.slug}`}
                key={related.id}
                className="group"
              >
                <div className="aspect-video relative rounded-xl overflow-hidden mb-4">
                  {related.coverImage && (
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                  {related.title}
                </h4>
                <p className="text-slate-500 text-sm line-clamp-2 mt-1">
                  {related.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
