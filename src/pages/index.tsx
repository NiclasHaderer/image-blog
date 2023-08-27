import Link from 'next/link';
import { getAllPosts, getPostGroups, getPostGroupUrls } from '@/utils/post';
import { MainLayout } from '@/components/main-layout';
import { copyImages, symlinkImages } from '@/utils/assets';
import { PostPreview } from '@/components/post-preview';

export default function Home({ groupUrls, allPosts }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <MainLayout navItems={groupUrls}>
      <h1 className="font-bold text-3xl px-2 mb-2 mt-1">Latest Posts</h1>
      {allPosts.map((post, i) => (
        <Link href={`/${post.group.slug}/${post.slug}`} key={i} className="drop-shadow-2xl">
          <PostPreview {...post} />
        </Link>
      ))}
    </MainLayout>
  );
}

export const getStaticProps = async () => {
  const postGroups = await getPostGroups();
  const groupUrls = await getPostGroupUrls();
  const allPosts = await getAllPosts();

  // Check if we are running in production
  if (process.env.NODE_ENV === 'production') {
    await copyImages(postGroups);
  } else {
    await symlinkImages(postGroups);
  }

  return {
    props: {
      groupUrls,
      allPosts,
    },
  };
};
