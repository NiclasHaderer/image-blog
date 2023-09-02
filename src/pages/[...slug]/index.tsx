import { GetStaticPaths } from 'next';
import { PostList } from '@/components/post-preview';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';
import { getAllPossiblePaths, getNavigation, getPost, getPostChildren } from '@/utils/post';

export default function PostGroupPage({
  post,
  navigation,
  parentPosts,
  children,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageFactory = getImageProps<string>(post.images, [...parentPosts, post.slug].join('/'));
  return (
    <>
      <Header
        isPostHeader={false}
        capabilities={['TODO', 'YOU', 'ARE', 'STATIC!!!!!']}
        groupUrls={navigation}
        title={post.title}
        backgroundImage={imageFactory(post.headerImage)}
        backgroundColor={post.headerColor}
      />
      <MainOutlet>
        <h1 className="mb-2 mt-1 px-2 text-3xl font-bold">{post.title}</h1>
        <p className="px-2 pb-2">{post.description}</p>
        {/*TODO layout*/}
        <PostList posts={children} parentPosts={parentPosts} />
      </MainOutlet>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (): Promise<{
  paths: { params: { slug?: string[] } }[];
  fallback: false;
}> => {
  return {
    paths: await getAllPossiblePaths().then((paths) => paths.map((path) => ({ params: { slug: path.slug } }))),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
  const slug = params.slug ?? [];
  const navigation = await getNavigation();
  const post = await getPost(...slug);
  const children = await getPostChildren(...slug);

  return {
    props: {
      navigation,
      post,
      children,
      parentPosts: slug,
    },
  };
};
