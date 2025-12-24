import { getEventBySlug } from "@/data/events";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { AddToCalendar } from "@/components/events/add-to-calendar";
import { RSVPButton } from "@/components/events/rsvp-button";

interface EventIdPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventIdPage({ params }: EventIdPageProps) {
  const { slug } = await params;
  const session = await auth();
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const isRegistered = event.rsvps.some(
    (rsvp) => rsvp.userId === session?.user?.id
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HERO IMAGE */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-slate-900">
        {event.coverImage && (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover opacity-60"
            priority
            unoptimized
          />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
              UPCOMING EVENT
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white max-w-3xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: DESCRIPTION */}
          <div className="lg:col-span-2 space-y-8">
            <div className="prose prose-lg max-w-none text-slate-600">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                About this Event
              </h3>
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR DETAILS */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border space-y-6">
              {/* DATE */}
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Date</h4>
                  <p className="text-slate-600">
                    {format(event.startDate, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* TIME */}
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm text-blue-600">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Time</h4>
                  <p className="text-slate-600">
                    {format(event.startDate, "h:mm a")} -{" "}
                    {format(event.endDate, "h:mm a")}
                  </p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Location</h4>
                  <p className="text-slate-600">{event.location}</p>
                </div>
              </div>

              {/* ATTENDEES */}
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg border shadow-sm text-blue-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Attendees</h4>
                  <p className="text-slate-600">
                    {event._count.rsvps} people going
                  </p>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* ACTIONS */}
              <div className="space-y-3">
                <RSVPButton
                  eventId={event.id}
                  isRegistered={isRegistered}
                  isLoggedIn={!!session?.user}
                />
                <AddToCalendar event={event} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
