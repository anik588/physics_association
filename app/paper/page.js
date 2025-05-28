'use client';
import { usePublicContent } from '../../context/PublicContentContext';

import Link from 'next/link';

export default function PaperPage() {
  const { content } = usePublicContent();
  const papers = content.notes || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Paper</h1>
      <ul>
        {paper.map((papers) => (
          <li key={note.id}>
            <Link href={`/papers/${papers.id}`}>{papers.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
