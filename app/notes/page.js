'use client';
import { usePublicContent } from '../../context/PublicContentContext';

import Link from 'next/link';

export default function NotesPage() {
  const { content } = usePublicContent();
  const notes = content.notes || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <ul>
        {notes.map((notes) => (
          <li key={note.id}>
            <Link href={`/notes/${notes.id}`}>{notes.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
