import { getHomepage, getHomepagePosts, getPostGroupUrls } from '@/utils/post';
import { copyImages, symlinkImages } from '@/utils/assets';
import { PostList } from '@/components/post-preview';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';

export default function Home({
  groupUrls,
  homepagePosts,
  homepage,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageProps = getImageProps<string>(homepage.images, 'homepage')(homepage.headerImage);

  return (
    <>
      <Header
        isPostHeader={false}
        capabilities={homepage.capabilities}
        title={homepage.title}
        groupUrls={groupUrls}
        backgroundImage={imageProps}
        secondMenuBelow={true}
      />
      <MainOutlet>
        <h1 className="my-1 hidden uppercase md:block">Recent</h1>
        <PostList posts={homepagePosts} />
      </MainOutlet>
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
