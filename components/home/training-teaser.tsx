import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, PlayCircle, Clock } from "lucide-react";

export function TrainingTeaser() {
  // Static teaser data
  const courses = [
    {
      id: 1,
      title: "Mastering the Audition Process",
      instructor: "Dr. Sarah Banks",
      rating: 4.9,
      students: 120,
      image:
        "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop",
      tag: "Acting",
    },
    {
      id: 2,
      title: "Personal Branding for Creatives",
      instructor: "Michael Ross",
      rating: 4.8,
      students: 85,
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
      tag: "Career",
    },
    {
      id: 3,
      title: "Voice Training Fundamentals",
      instructor: "Coach Kemi",
      rating: 5.0,
      students: 200,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1638&auto=format&fit=crop",
      tag: "Music",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Level Up Your Skills
            </h2>
            <p className="text-slate-600 text-lg">
              Professional courses designed to help you succeed in the industry.
              Learn from the best.
            </p>
          </div>
          <Link href="/courses">
            <Button className="bg-[#1E40AF] hover:bg-[#1E40AF]/90">
              Explore All Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition-all duration-300"
            >
              {/* Image Area */}
              <div
                className="h-48 bg-slate-200 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${course.image})` }}
              >
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-slate-900 shadow-sm">
                  {course.tag}
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg">
                    <PlayCircle className="w-6 h-6 text-[#1E40AF] ml-1" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(course.rating)
                            ? "fill-current"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({course.students} students)
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-[#1E40AF] transition-colors line-clamp-1">
                  {course.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <BookOpen className="w-4 h-4" />
                  <span>By {course.instructor}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2h 15m</span>
                  </div>
                  <span className="text-[#1E40AF] font-bold text-sm">
                    Enroll Now
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
