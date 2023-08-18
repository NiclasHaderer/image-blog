import { getPost, getPosts } from '../../utils/posts';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import { Something } from '../../components/something';

export default function Post({ data, content }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <div>
      <h1 className="font-bold text-7xl mt-24 mb-12">{data.title}</h1>
      <time className="text-gray-500 italic">{data.date}</time>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>
      <div className="prose mt-12">
        <MDXRemote {...content} components={{ Something: Something }} />
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
    data: Awaited<ReturnType<typeof getPost>>['data'];
    content: Awaited<ReturnType<typeof serialize>>;
  };
}> => {
  const post = await getPost(params.slug);
  const mdxSource = await serialize(post.content);
  return {
    props: {
      data: JSON.parse(JSON.stringify(post.data)),
      content: mdxSource,
    },
  };
};
