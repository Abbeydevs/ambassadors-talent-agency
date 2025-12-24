import Link from "next/link";
import {
  Mic,
  Video,
  Camera,
  Music,
  Palette,
  Tv,
  BookOpen,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function TalentCategories() {
  const categories = [
    { name: "Actors", icon: Video, color: "bg-red-100 text-red-600" },
    { name: "Models", icon: Camera, color: "bg-purple-100 text-purple-600" },
    { name: "Musicians", icon: Music, color: "bg-blue-100 text-blue-600" },
    { name: "Dancers", icon: Mic, color: "bg-pink-100 text-pink-600" },
    { name: "Presenters", icon: Tv, color: "bg-amber-100 text-amber-600" },
    { name: "Creatives", icon: Palette, color: "bg-green-100 text-green-600" },
  ];

  return (
    <section className="py-20 bg-white border-b">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
          Find Talent Across All Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/talents?category=${cat.name}`}
              className="group"
            >
              <div className="p-6 rounded-xl border hover:shadow-lg transition-all hover:-translate-y-1 bg-white h-full flex flex-col items-center justify-center gap-4">
                <div
                  className={`w-16 h-16 ${cat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-slate-900">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/talents">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Browse All Talent
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TrainingTeaser() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Level Up Your Skills
            </h2>
            <p className="text-slate-600 max-w-xl">
              Professional courses designed to help you succeed in the industry.
            </p>
          </div>
          <Link href="/courses">
            <Button>Explore All Courses</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-sm border group"
            >
              <div className="h-48 bg-slate-200 relative flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-slate-400" />
                <span className="absolute top-4 right-4 bg-white px-2 py-1 text-xs font-bold rounded shadow-sm">
                  Coming Soon
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                  <span className="text-xs text-slate-500 ml-2">(5.0)</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  Mastering the Audition Process
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Learn how to stand out and book more roles with expert
                  guidance.
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                    <span className="text-sm font-medium">Dr. Creative</span>
                  </div>
                  <span className="text-blue-600 font-bold">$49.99</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Actress",
      quote:
        "Ambassador Talent Agency completely changed my career. I booked my first major commercial within two weeks of joining!",
    },
    {
      name: "David Okafor",
      role: "Casting Director",
      quote:
        "The quality of talent on this platform is unmatched. It saves us so much time finding exactly who we need for our productions.",
    },
    {
      name: "Michael Chen",
      role: "Model",
      quote:
        "The training courses helped me refine my portfolio. Now I feel confident applying for international gigs.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl relative">
              <Quote className="w-10 h-10 text-blue-100 absolute top-6 left-6" />
              <div className="relative z-10 pt-4">
                <p className="text-slate-700 italic mb-6 leading-relaxed">
                  &quot;{review.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-sm text-slate-500">{review.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
