import Link from "next/link";
import Image from "next/image";
import { getAllEvents } from "@/data/events";
import { getAllSuccessStories } from "@/data/success-stories";
import { ArrowRight } from "lucide-react";
import EventCard from "@/components/events/event-card";

export async function FeaturedEventsSection() {
  const events = await getAllEvents();
  const recentEvents = events.slice(0, 3);

  if (recentEvents.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Upcoming Events
            </h2>
            <p className="text-slate-600">
              Networking, workshops, and auditions.
            </p>
          </div>
          <Link
            href="/events"
            className="text-blue-600 font-semibold flex items-center hover:underline"
          >
            View All Events <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentEvents.map((event) => (
            <div key={event.id} className="h-full">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function SuccessStoriesSection() {
  const stories = await getAllSuccessStories();
  const featured = stories.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            See how our talents are making waves in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((story) => (
            <Link
              key={story.id}
              href={`/success-stories/${story.slug}`}
              className="group"
            >
              <div className="relative h-[400px] rounded-xl overflow-hidden bg-slate-200">
                <Image
                  src={story.coverImage || "/placeholder-image.jpg"}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded-full mb-3">
                    {story.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span>{story.talent?.name || "Ambassador Talent"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/success-stories">
            <Button variant="outline" size="lg">
              Read More Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Helper Button component specifically for this file to avoid import issues
import { Button } from "@/components/ui/button";
