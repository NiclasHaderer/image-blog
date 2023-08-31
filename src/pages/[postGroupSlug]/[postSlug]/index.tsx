import Head from 'next/head';
import { GetStaticPaths } from 'next';
import { getHomepage, getPost, getPostContent, getPostGroups, getPostGroupUrls } from '@/utils/post';
import { MDXRemote } from 'next-mdx-remote';
import { Image } from '@/components/image';
import { LightboxImage } from '@/components/lightbox-image';
import { Gallery } from '@/components/gallery';
import { getImageProps } from '@/utils/image-props';
import { Header } from '@/components/header';
import { MainOutlet } from '@/components/main-outlet';

export default function Post({
  post,
  content,
  groupUrls,
  homepage,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  const imageFactory = getImageProps<string>(post.images, `${post.group.slug}/${post.slug}`);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
      </Head>
      <Header
        isPostHeader={true}
        capabilities={homepage.capabilities}
        groupUrls={groupUrls}
        title={post.title}
        backgroundImage={imageFactory(post.headerImage)}
        backgroundColor={post.headerColor}
      />

      <MainOutlet>
        <div className="prose max-w-none">
          <h1>{post.title}</h1>

          <article>
            <MDXRemote {...content} components={{ Image, LightboxImage, Gallery }} scope={{ getImage: imageFactory }} />
          </article>
        </div>
      </MainOutlet>
    </>
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
  const homepage = await getHomepage();

  return {
    props: {
      homepage,
      post,
      content,
      groupUrls,
    },
  };
};
