import { GetStaticPaths } from 'next';
import Link from 'next/link';
import { getPostGroup, getPostGroups, getPostGroupUrls, getPostsOfGroup } from '@/utils/post';
import { PostPreview } from '@/components/post-preview';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';

export default function PostGroupPage({
  postGroup,
  groupUrls,
  posts,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageFactory = getImageProps<string>(postGroup.images, postGroup.slug);
  return (
    <>
      <Header
        groupUrls={groupUrls}
        title={postGroup.title}
        backgroundImage={imageFactory(postGroup.headerImage)}
        backgroundColor={postGroup.headerColor}
      />
      <MainOutlet>
        <h1 className="font-bold text-3xl px-2 mb-2 mt-1">{postGroup.title}</h1>
        <p className="pb-2 px-2">{postGroup.description}</p>

        {posts.map((post, i) => (
          <Link href={`/${postGroup.slug}/${post.slug}`} key={i} className="drop-shadow-2xl">
            <PostPreview {...post} />
          </Link>
        ))}
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

  return {
    props: {
      postGroup: postGroup,
      groupUrls,
      posts,
    },
  };
};
