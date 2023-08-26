import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import Head from 'next/head';
import { GetStaticPaths } from 'next';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { CompiledPost } from '@/models/raw-post';

export default function Post({ metadata, content, slug }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <main className="flex justify-center">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <div className="prose">
        <h1>{metadata.title}</h1>

        <article>
          {/*<MDXRemote*/}
          {/*  {...content}*/}
          {/*  components={{ Image, LightboxImage, Gallery }}*/}
          {/*  scope={{ getImageProps: getImageProps(slug, imagesMetadata.imageSizes) }}*/}
          {/*/>*/}
        </article>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = [{ slug: 'test' }];
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
    metadata: CompiledPost;
    content: MDXRemoteSerializeResult;
    slug: string;
  };
}> => {
  const slug = params!.slug as string;
  const post = [{ slug: 'test' }];
  const mdxSource = await serialize('#hello world', {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkEmoji],
    },
  });
  return {
    props: {
      metadata: JSON.parse(JSON.stringify({})),
      content: mdxSource,
      slug: slug,
    },
  };
};
