import CalendarView from "@/components/events/calendar-view";
import EventCard from "@/components/events/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents } from "@/data/events";
import { CalendarIcon, Grid } from "lucide-react";

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER */}
      <div className="bg-slate-50 border-b border-gray-200 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-heading">
            Upcoming Events
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Workshops, auditions, and networking opportunities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Schedule</h2>
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="w-4 h-4" /> Grid
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Calendar
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid">
            {events.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                No events found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView events={events} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
