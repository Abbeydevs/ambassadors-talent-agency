import Link from "next/link";
import {
  Mic,
  Video,
  Camera,
  Music,
  Palette,
  Tv,
  ArrowRight,
} from "lucide-react";

export function TalentCategories() {
  const categories = [
    {
      name: "Actors",
      value: "Actor",
      icon: Video,
      color: "bg-red-100 text-red-600",
      border: "border-red-100 hover:border-red-200",
    },
    {
      name: "Models",
      value: "Model",
      icon: Camera,
      color: "bg-purple-100 text-purple-600",
      border: "border-purple-100 hover:border-purple-200",
    },
    {
      name: "Musicians",
      value: "Musician",
      icon: Music,
      color: "bg-blue-100 text-blue-600",
      border: "border-blue-100 hover:border-blue-200",
    },
    {
      name: "Dancers",
      value: "Dancer",
      icon: Mic,
      color: "bg-pink-100 text-pink-600",
      border: "border-pink-100 hover:border-pink-200",
    },
    {
      name: "Presenters",
      value: "Presenter",
      icon: Tv,
      color: "bg-amber-100 text-amber-600",
      border: "border-amber-100 hover:border-amber-200",
    },
    {
      name: "Voice Over",
      value: "Voice Over Artist",
      icon: Palette,
      color: "bg-green-100 text-green-600",
      border: "border-green-100 hover:border-green-200",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Find Talent Across All Categories
          </h2>
          <p className="text-slate-600">
            Browse our diverse pool of creative professionals ready for your
            next project.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/talents?category=${encodeURIComponent(cat.value)}`}
              className="group h-full"
            >
              <div
                className={`p-8 rounded-2xl border ${cat.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white h-full flex flex-col items-center justify-center gap-6 group`}
              >
                <div
                  className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <cat.icon className="w-9 h-9" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-[#1E40AF] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
