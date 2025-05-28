import { notFound } from 'next/navigation';
export default async function NoteDetail({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes/${params.id}/`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const note = await res.json();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <a className="text-blue-600 underline" href={note.file} target="_blank" rel="noopener noreferrer">View PDF</a>
    </div>
  );
}
