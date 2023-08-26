import Link from 'next/link';
import { copyImages, getPostGroups, symlinkImages } from '@/utils/post';

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

export const getStaticProps = async () => {
  const postGroups = await getPostGroups();

  // Check if we are running in production
  if (process.env.NODE_ENV === 'production') {
    await copyImages(postGroups);
  } else {
    await symlinkImages(postGroups);
  }

  return {
    props: {
      postGroups,
    },
  };
};
