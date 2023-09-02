import { getHomepage, getHomepagePosts, getPostGroupUrls } from '@/utils/post';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';
import { ElegantList } from '@/components/elegant-preview';

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
        capabilitiesBelow={true}
      />
      <MainOutlet>
        <h1 className="my-1 hidden uppercase md:block">Recent</h1>
        <ElegantList posts={homepagePosts} />
      </MainOutlet>
    </>
  );
}

export const getStaticProps = async () => {
  const groupUrls = await getPostGroupUrls();
  const homepage = await getHomepage();
  const homepagePosts = await getHomepagePosts();

  return {
    props: {
      groupUrls,
      homepagePosts,
      homepage,
    },
  };
};
