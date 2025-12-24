import { getEventGuests } from "@/data/events";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft, Mail, Calendar, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { ExportGuestsButton } from "@/components/admin/events/export-guests-button";

interface EventGuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventGuestsPage({
  params,
}: EventGuestsPageProps) {
  const { id } = await params;
  const event = await getEventGuests(id);

  if (!event) return notFound();

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/admin/events"
            className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Guest List: {event.title}
          </h1>
          <p className="text-slate-500">
            {event.rsvps.length} registered attendees
          </p>
        </div>

        <ExportGuestsButton data={event.rsvps} eventName={event.title} />
      </div>

      {/* GUEST TABLE */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="h-12 px-6 font-medium text-slate-500">Talent</th>
              <th className="h-12 px-6 font-medium text-slate-500">Email</th>
              <th className="h-12 px-6 font-medium text-slate-500">
                Registered On
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {event.rsvps.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-slate-500">
                  No one has registered for this event yet.
                </td>
              </tr>
            ) : (
              event.rsvps.map((rsvp) => (
                <tr
                  key={rsvp.user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 px-6 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border">
                        {rsvp.user.image ? (
                          <Image
                            src={rsvp.user.image}
                            alt="User"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-slate-900">
                        {rsvp.user.name || "Anonymous"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 px-6 align-middle text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {rsvp.user.email}
                    </div>
                  </td>
                  <td className="p-4 px-6 align-middle text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {format(
                        new Date(rsvp.createdAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
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
