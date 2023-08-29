import Link from 'next/link';
import { getAllPosts, getPostGroupUrls } from '@/utils/post';
import { copyImages, symlinkImages } from '@/utils/assets';
import { PostPreview } from '@/components/post-preview';
import { HomePage, Test } from '@/components/home-page';
import { SIZE } from '@/components/main-layout';

export default function Home({ groupUrls, allPosts }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <>
      <HomePage groupUrls={groupUrls} />
      <Test groupUrls={groupUrls} />
      <main className={SIZE}>
        <h1 className="text-3xl px-2 mb-2 mt-1">Recent</h1>
        {allPosts.map((post, i) => (
          <Link
            href={`/${post.group.slug}/${post.slug}`}
            key={i}
            className="transition-all drop-shadow-sm hover:drop-shadow-2xl"
          >
            <PostPreview {...post} />
          </Link>
        ))}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const groupUrls = await getPostGroupUrls();
  const allPosts = await getAllPosts();

  // Check if we are running in production
  if (process.env.NODE_ENV === 'production') {
    await copyImages();
  } else {
    await symlinkImages();
  }

  return {
    props: {
      groupUrls,
      allPosts,
    },
  };
};
