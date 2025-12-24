import EventForm from "@/components/admin/events/event-form";

export default function CreateEventPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Create New Event</h1>
      <div className="max-w-3xl">
        <EventForm />
      </div>
    </div>
  );
}
