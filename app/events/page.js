'use client';
import { usePublicContent } from '../../context/PublicContentContext';

import Link from 'next/link';

export default function EventsPage() {
  const { content } = usePublicContent();
  const events = content.events || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <ul>
        {events.map((events) => (
          <li key={event.id}>
            <Link href={`/events/${events.id}`}>{events.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
