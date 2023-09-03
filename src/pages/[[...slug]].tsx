import { GetStaticPaths } from 'next';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';
import { getAllPossiblePaths, getNavigation, getPost, getPostChildren } from '@/utils/post';
import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { LightboxImage } from '@/components/lightbox-image';
import { Gallery } from '@/components/gallery';
import { Image } from '@/components/image';
import { WithChildView } from '@/components/with-childview';

export default function PostGroupPage({
  post,
  navigation,
  parentPosts,
  children,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageFactory = getImageProps<string>(post.images, parentPosts.join('/'));
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
      <p>People | Weddings | Animals | Travel</p>
      <MainOutlet>
        <h1 className={`mb-2 mt-1 px-2 text-2xl font-normal ${post.capitalizeTitle ? 'uppercase' : ''}`}>
          {post.title}
        </h1>

        <WithChildView post={post} parentPosts={parentPosts} childPosts={children}>
          <article>
            <MDXRemote
              {...post.content}
              components={{ Image, LightboxImage, Gallery }}
              scope={{ getImage: imageFactory }}
            />
          </article>
        </WithChildView>
      </MainOutlet>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (): Promise<{
  paths: { params: { slug?: string[] } }[];
  fallback: false;
}> => {
  return {
    paths: await getAllPossiblePaths().then((paths) => paths.map((path) => ({ params: path }))),
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
