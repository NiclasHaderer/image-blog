import { getPosts } from '../../utils/posts';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Head from 'next/head';
import { Image } from '../../components/image';
import { getPost, getPostImagesMetadata } from '../../utils/post';
import { getImageProps } from '../../utils/image-props';
import { LightboxImage } from '../../components/lightbox-image';
import { PostMetadata } from '../../utils/post-metadata';
import { PostImagesMetadata } from '../../utils/post-images-metadata';
import { Gallery } from '../../components/gallery';

export default function Post({
  metadata,
  content,
  slug,
  imagesMetadata,
}: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <div>
      <h1 className="font-bold text-7xl mt-24 mb-12">{metadata.title}</h1>
      <time className="text-gray-500 italic">{metadata.date}</time>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <div className="prose mt-12">
        <MDXRemote
          {...content}
          components={{ Image, LightboxImage, Gallery }}
          scope={{ getImageProps: getImageProps(slug, imagesMetadata.imageSizes) }}
        />
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
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
  const post = await getPost(params.slug);
  const imagesMetadata = await getPostImagesMetadata(params.slug);
  const mdxSource = await serialize(post.content);
  return {
    props: {
      metadata: JSON.parse(JSON.stringify(post.metadata)),
      imagesMetadata: JSON.parse(JSON.stringify(imagesMetadata)),
      content: mdxSource,
      slug: params.slug,
    },
  };
};
