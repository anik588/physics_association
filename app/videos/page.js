'use client';
import { usePublicContent } from '../../context/PublicContentContext';

import Link from 'next/link';

export default function VideosPage() {
  const { content } = usePublicContent();
  const videos = content.videos || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      <ul>
        {video.map((videos) => (
          <li key={video.id}>
            <Link href={`/videos/${videos.id}`}>{videos.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
