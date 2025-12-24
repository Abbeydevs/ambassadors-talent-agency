import EventForm from "@/components/admin/events/event-form";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
  });

  if (!event) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Edit Event</h1>
      <div className="max-w-3xl">
        <EventForm initialData={event} />
      </div>
    </div>
  );
}
