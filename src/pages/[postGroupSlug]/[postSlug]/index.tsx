import Head from 'next/head';
import { GetStaticPaths } from 'next';
import { getPost, getPostContent, getPostGroups, getPostGroupUrls } from '@/utils/post';
import { MDXRemote } from 'next-mdx-remote';
import { Image } from '@/components/image';
import { LightboxImage } from '@/components/lightbox-image';
import { Gallery } from '@/components/gallery';
import { getImageProps } from '@/utils/image-props';
import { MainLayout } from '@/components/main-layout';

export default function Post({ post, content, groupUrls }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <MainLayout navItems={groupUrls}>
      <main className="flex justify-center">
        <Head>
          <title>{post.title}</title>
          <meta name="description" content={post.description} />
        </Head>
        <div className="prose max-w-none">
          <h1>{post.title}</h1>

          <article>
            <MDXRemote
              {...content}
              components={{ Image, LightboxImage, Gallery }}
              scope={{ getImageProps: getImageProps(post.images, `${post.group.slug}/${post.slug}`) }}
            />
          </article>
        </div>
      </main>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postGroups = await getPostGroups();
  const paths = postGroups.flatMap((postGroup) =>
    Object.values(postGroup.posts).map((post) => ({ params: { postSlug: post.slug, postGroupSlug: postGroup.slug } })),
  );
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: { params: { postSlug: string; postGroupSlug: string } }) => {
  const post = await getPost(params.postGroupSlug, params.postSlug);
  const content = await getPostContent(params.postGroupSlug, params.postSlug);
  const groupUrls = await getPostGroupUrls();

  return {
    props: {
      post,
      content,
      groupUrls,
    },
  };
};
