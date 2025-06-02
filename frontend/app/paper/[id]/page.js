import { notFound } from 'next/navigation';
export default async function PaperDetail({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/papers/${params.id}/`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const paper = await res.json();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>
      <p className="mb-2 italic">{paper.abstract}</p>
      <a className="text-blue-600 underline" href={paper.document} target="_blank" rel="noopener noreferrer">Download PDF</a>
    </div>
  );
}
