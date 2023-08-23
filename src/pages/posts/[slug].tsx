import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Head from 'next/head';
import { GetStaticPaths } from 'next';
import { getImageProps } from '@/utils/image-props';
import { getPosts } from '@/utils/posts';
import { Image } from '@/components/image';
import { PostMetadata } from '@/models/post-metadata';
import { PostImagesMetadata } from '@/models/post-images-metadata';
import { getPost, getPostImagesMetadata } from '@/utils/post';
import { LightboxImage } from '@/components/lightbox-image';
import { Gallery } from '@/components/gallery';

export default function Post({
  metadata,
  content,
  slug,
  imagesMetadata,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <main className="flex justify-center">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <div className="prose">
        <h1>{metadata.title}</h1>

        <article>
          <MDXRemote
            {...content}
            components={{ Image, LightboxImage, Gallery }}
            scope={{ getImageProps: getImageProps(slug, imagesMetadata.imageSizes) }}
          />
        </article>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  const paths = posts.map((post) => ({ params: { slug: post.slug } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}): Promise<{
  props: {
    metadata: PostMetadata;
    content: MDXRemoteSerializeResult;
    imagesMetadata: PostImagesMetadata;
    slug: string;
  };
}> => {
  const slug = params!.slug as string;
  const post = await getPost(slug);
  const imagesMetadata = await getPostImagesMetadata(slug);
  const mdxSource = await serialize(post.content);
  return {
    props: {
      metadata: JSON.parse(JSON.stringify(post.metadata)),
      imagesMetadata: JSON.parse(JSON.stringify(imagesMetadata)),
      content: mdxSource,
      slug: slug,
    },
  };
};
