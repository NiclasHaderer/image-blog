import { CompiledPostGroup } from '@/models/raw-post';

export default function Home({ posts }: { posts: CompiledPostGroup[] }) {
  return (
    <div>
      <h1 className="mt-24 mb-12 font-bold text-3xl">Latest Posts</h1>
      {posts.map((post) => (
        <div>hello</div>
        // <PostCard {...post.data} key={post.slug} slug={post.slug} />
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = await [1, 2, 3];
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
