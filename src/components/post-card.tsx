import Link from 'next/link';
import { FC } from 'react';
import type { CompiledPost } from '@/models/raw-post';

export const PostCard: FC<CompiledPost & { slug: string }> = ({ title, date, description, slug }) => {
  return (
    <div className="my-4 py-4 border-b">
      <h2 className="font-bold text-2xl my-4">{title}</h2>
      {date && <time className="text-gray-400">{date}</time>}
      {description && <p className="mt-4 italic">{description}</p>}

      <Link className="text-blue-500 mt-4 mb-2 block" href={`/posts/${slug}`}>
        Read more
      </Link>
    </div>
  );
};
