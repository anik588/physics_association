import { notFound } from 'next/navigation';

export default async function BlogDetail({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${params.id}/`, {
    cache: 'no-store'
  });
  if (!res.ok) return notFound();
  const blog = await res.json();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
      <p className="mb-2 text-gray-600">By: {blog.author}</p>
      <div className="prose max-w-none">
        <p>{blog.content}</p>
      </div>
      <p className="mt-4 text-sm italic">Views: {blog.views}</p>
    </div>
  );
}
