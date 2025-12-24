import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    startDate: Date;
    coverImage: string | null;
    _count: { rsvps: number };
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug}`} className="group block h-full">
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
        {/* IMAGE SECTION */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <Calendar className="w-10 h-10 opacity-20" />
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm min-w-[60px]">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              {format(event.startDate, "MMM")}
            </span>
            <span className="block text-xl font-bold text-slate-900 leading-none">
              {format(event.startDate, "d")}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col grow">
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{event._count.rsvps} attending</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm font-medium text-blue-600">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
