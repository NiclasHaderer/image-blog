import { CompiledPostGroup } from '@/models/raw-post';
import { GetStaticPaths } from 'next';
import Link from 'next/link';
import { getPostGroup, getPostGroups } from '@/utils/post';

export default function PostGroupPage({ postGroup }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
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
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postGroupPaths = await getPostGroups();
  return {
    paths: postGroupPaths.map((postGroupPath) => ({ params: { postGroupSlug: postGroupPath.slug } })),
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { postGroupSlug: string };
}): Promise<{
  props: { postGroup: CompiledPostGroup };
}> => {
  const postGroup = getPostGroup(params.postGroupSlug);
  return {
    props: {
      postGroup: JSON.parse(JSON.stringify(postGroup)),
    },
  };
};
