import { GetStaticPaths } from 'next';
import Link from 'next/link';
import { getPostGroup, getPostGroups, getPostGroupUrls } from '@/utils/post';
import { MainLayout } from '@/components/main-layout';

export default function PostGroupPage({ postGroup, groupUrls }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <MainLayout navItems={groupUrls}>
      <div>
        <h1>{postGroup.title}</h1>
        <p>{postGroup.description}</p>
        <ul>
          {Object.values(postGroup.posts).map((post) => (
            <li key={post.slug}>
              <Link href={`${postGroup.slug}/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
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

  return {
    props: {
      postGroup: postGroup,
      groupUrls,
    },
  };
};
