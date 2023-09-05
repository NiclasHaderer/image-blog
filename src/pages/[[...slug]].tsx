import { GetStaticPaths } from 'next';
import { Header } from '@/components/header';
import { getImageProps } from '@/utils/image-props';
import { MainOutlet } from '@/components/main-outlet';
import { getAllPossiblePaths, getNavigation, getPostWitchChildren } from '@/utils/post';
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
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageFactory = getImageProps<string>(post.images, parentPosts.join('/'));
  return (
    <>
      <Header
        isPostHeader={false}
        capabilities={['People', 'Wedding', 'Animals', 'Travel']}
        capabilitiesBelow={parentPosts.length === 0}
        groupUrls={navigation}
        title={post.title}
        backgroundImage={imageFactory(post.headerImage)}
        backgroundColor={post.headerColor}
      />
      <MainOutlet>
        <WithChildView post={post} parentPosts={parentPosts}>
          <article className="prose max-w-none">
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
  const post = await getPostWitchChildren(...slug);

  return {
    props: {
      navigation,
      post,
      parentPosts: slug,
    },
  };
};
