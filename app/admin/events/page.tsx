import Link from "next/link";
import { getAdminEvents } from "@/data/events";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Users, Star } from "lucide-react";
import { format } from "date-fns";
import { DeleteEventButton } from "@/components/events/delete-event-button";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events Manager</h1>
          <p className="text-muted-foreground">
            Create and manage events, workshops, and auditions.
          </p>
        </div>
        <Link href="/admin/events/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="h-12 px-4 font-medium text-slate-500">Date</th>
              <th className="h-12 px-4 font-medium text-slate-500">
                Event Name
              </th>
              <th className="h-12 px-4 font-medium text-slate-500">Category</th>
              <th className="h-12 px-4 font-medium text-slate-500">RSVPs</th>
              <th className="h-12 px-4 font-medium text-slate-500">Status</th>
              <th className="h-12 px-4 font-medium text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No events found. Click &quot;Create Event&quot; to start.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 align-middle whitespace-nowrap">
                    {format(event.startDate, "MMM d, yyyy")}
                  </td>
                  <td className="p-4 align-middle font-medium text-slate-900">
                    {event.title}
                    {event.featured && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                        <Star className="w-3 h-3 mr-1 fill-amber-600" />{" "}
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                      {event.category || "General"}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{event._count.rsvps}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {event.isPublished ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Guest List (We will build this later) */}
                      <Link href={`/admin/events/${event.id}/rsvps`}>
                        <Button variant="outline" size="sm" className="h-8">
                          View Guests
                        </Button>
                      </Link>

                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                      </Link>

                      <DeleteEventButton eventId={event.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
