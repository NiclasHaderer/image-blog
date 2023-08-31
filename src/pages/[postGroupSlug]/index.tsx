import { GetStaticPaths } from 'next';
import { getHomepage, getPostGroup, getPostGroups, getPostGroupUrls, getPostsOfGroup } from '@/utils/post';
import { PostList } from '@/components/post-preview';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';

export default function PostGroupPage({
  postGroup,
  groupUrls,
  posts,
  homepage,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageFactory = getImageProps<string>(postGroup.images, postGroup.slug);
  return (
    <>
      <Header
        capabilities={homepage.capabilities}
        groupUrls={groupUrls}
        title={postGroup.title}
        backgroundImage={imageFactory(postGroup.headerImage)}
        backgroundColor={postGroup.headerColor}
      />
      <MainOutlet>
        <h1 className="mb-2 mt-1 px-2 text-3xl font-bold">{postGroup.title}</h1>
        <p className="px-2 pb-2">{postGroup.description}</p>
        <PostList posts={posts} />
      </MainOutlet>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postGroupPaths = await getPostGroups();
  return {
    paths: postGroupPaths.map((postGroupPath) => ({ params: { postGroupSlug: postGroupPath.slug } })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: { params: { postGroupSlug: string } }) => {
  const postGroup = await getPostGroup(params.postGroupSlug);
  const groupUrls = await getPostGroupUrls();
  const posts = await getPostsOfGroup(postGroup.slug);
  const homepage = await getHomepage();

  return {
    props: {
      postGroup: postGroup,
      groupUrls,
      posts,
      homepage,
    },
  };
};
