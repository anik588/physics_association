import { notFound } from 'next/navigation';
export default async function VideoDetail({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/videos/${params.id}/`, { cache: 'no-store' });
  if (!res.ok) return notFound();
  const video = await res.json();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <iframe className="w-full h-80" src={video.youtube_url.replace('watch?v=', 'embed/')} frameBorder="0" allowFullScreen />
    </div>
  );
}
