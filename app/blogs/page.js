'use client';
import { usePublicContent } from '../../context/PublicContentContext';

import Link from 'next/link';

export default function BlogsPage() {
  const { content } = usePublicContent();
  const blogs = content.blogs || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>
      <ul>
        {blogs.map((blogs) => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
