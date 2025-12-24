import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Testimonials() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Actress",
      quote:
        "Ambassador Talent Agency completely changed my career. I booked my first major commercial within two weeks of joining!",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    },
    {
      name: "David Okafor",
      role: "Casting Director",
      quote:
        "The quality of talent on this platform is unmatched. It saves us so much time finding exactly who we need for our productions.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "Model",
      quote:
        "The training courses helped me refine my portfolio. Now I feel confident applying for international gigs.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-slate-50 p-8 rounded-2xl relative border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-10 h-10 text-blue-100 absolute top-6 left-6" />
              <div className="relative z-10 pt-6">
                <p className="text-slate-700 italic mb-8 leading-relaxed">
                  &quot;{review.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={review.image} />
                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                    <p className="text-sm text-blue-600 font-medium">
                      {review.role}
                    </p>
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
