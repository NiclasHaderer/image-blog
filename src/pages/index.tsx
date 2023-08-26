import Link from 'next/link';
import { getPostGroups } from '@/utils/post';

export default function Home({ postGroups }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <div>
      <h1 className="mt-24 mb-12 font-bold text-3xl">Latest Posts</h1>
      {postGroups.map((group, i) => (
        <Link href={`/${group.slug}`} key={i}>
          {group.title} - {group.description}
        </Link>
      ))}
    </div>
  );
}

// TODO symlink image folders from posts in dev, copy in prod
export const getStaticProps = async () => {
  const postGroups = await getPostGroups();
  return {
    props: {
      postGroups,
    },
  };
};
