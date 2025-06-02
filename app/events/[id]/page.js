import { notFound } from 'next/navigation';
export default async function EventDetail({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.id}/`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const event = await res.json();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <p>{event.description}</p>
      <p className="mt-2 text-sm italic">Date: {new Date(event.event_date).toLocaleString()}</p>
    </div>
  );
}
