import CalendarView from "@/components/events/calendar-view";
import EventCard from "@/components/events/event-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents } from "@/data/events";
import { CalendarIcon, Grid } from "lucide-react";
import { EventSearchInput } from "@/components/events/event-search-input";
import { startOfToday, startOfWeek, startOfMonth } from "date-fns";
import { EventFilters } from "@/components/events/event-filter";

interface EventsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    date?: string;
  }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;

  let filterDate: Date | undefined = undefined;
  if (params.date === "today") filterDate = startOfToday();
  else if (params.date === "week") filterDate = startOfWeek(new Date());
  else if (params.date === "month") filterDate = startOfMonth(new Date());
  else filterDate = new Date();

  const events = await getAllEvents({
    query: params.q,
    category: params.category,
    location: params.location,
    startDate: filterDate,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER SECTION */}
      <div className="bg-white border-b py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Upcoming Events
          </h1>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Find auditions, workshops, and networking opportunities to boost
            your career.
          </p>
          <EventSearchInput />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <EventFilters />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-sm text-slate-500">
                  Showing <strong>{events.length}</strong> events
                </p>
                <TabsList>
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Grid className="w-4 h-4" /> Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="flex items-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" /> Calendar
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid" className="mt-0">
                {events.length === 0 ? (
                  <div className="text-center py-24 bg-white rounded-xl border border-dashed">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">
                      No events found
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">
                      Try adjusting your search terms or filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <div key={event.id} className="h-full">
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <CalendarView events={events} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
