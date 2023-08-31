import Link from 'next/link';
import { getHomepage, getHomepagePosts, getPostGroupUrls } from '@/utils/post';
import { copyImages, symlinkImages } from '@/utils/assets';
import { PostPreview } from '@/components/post-preview';
import { HomePage, Test } from '@/components/home-page';
import { SIZE } from '@/components/main-layout';
import { getImageProps } from '@/utils/image-props';

export default function Home({
  groupUrls,
  homepagePosts,
  homepage,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageProps = getImageProps<string>(homepage.images, 'homepage')(homepage.headerImage);

  return (
    <>
      <HomePage groupUrls={groupUrls} backgroundImage={imageProps} />
      <Test groupUrls={groupUrls} />
      <main className={SIZE}>
        <h1 className="hidden md:block text-2xl px-2 mb-2 mt-1 uppercase">Recent</h1>
        {homepagePosts.map((post, i) => (
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
  const homepage = await getHomepage();
  const homepagePosts = await getHomepagePosts();

  // Check if we are running in production
  if (process.env.NODE_ENV === 'production') {
    await copyImages();
  } else {
    await symlinkImages();
  }

  return {
    props: {
      groupUrls,
      homepagePosts,
      homepage,
    },
  };
};
