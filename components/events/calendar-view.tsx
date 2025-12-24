"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  slug: string;
  location: string;
  startDate: Date;
  description: string;
}

interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter events for the selected date
  const selectedDateEvents = events.filter((event) =>
    date ? isSameDay(new Date(event.startDate), date) : false
  );

  const daysWithEvents = events.map((event) => new Date(event.startDate));

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="bg-white p-4 rounded-xl border shadow-sm mx-auto md:mx-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          captionLayout="dropdown"
          fromYear={2024}
          toYear={2030}
          modifiers={{
            hasEvent: daysWithEvents,
          }}
          modifiersStyles={{
            hasEvent: {
              fontWeight: "bold",
              textDecoration: "underline",
              color: "var(--primary)",
            },
          }}
        />
        <div className="mt-4 text-xs text-slate-500 text-center">
          <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />
          Dates with events are underlined
        </div>
      </div>

      {/* 2. SELECTED DATE DETAILS */}
      <div className="flex-1 w-full">
        <div className="bg-slate-50 rounded-xl p-6 border h-full min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Events for {date ? format(date, "MMMM d, yyyy") : "Selected Date"}
          </h3>

          {selectedDateEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <p>No events scheduled for this day.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow group"
                >
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(event.startDate), "h:mm a")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
