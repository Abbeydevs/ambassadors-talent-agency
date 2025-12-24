import { Users, Briefcase, FileText, Globe } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      label: "Talents Registered",
      value: "10,000+",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Active Employers",
      value: "500+",
      icon: Briefcase,
      color: "text-amber-400",
    },
    {
      label: "Jobs Posted",
      value: "2,000+",
      icon: FileText,
      color: "text-green-400",
    },
    {
      label: "Countries Reached",
      value: "7",
      icon: Globe,
      color: "text-purple-400",
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {stat.value}
              </h3>
              <p className="text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
