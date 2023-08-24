import { PostCard } from '@/components/post-card';
import type { ListedPost } from '../../post-manager/posts';
import { getPosts } from '../../post-manager/posts';

export default function Home({ posts }: { posts: ListedPost[] }) {
  return (
    <div>
      <h1 className="mt-24 mb-12 font-bold text-3xl">Latest Posts</h1>
      {posts.map((post) => (
        <PostCard {...post.data} key={post.slug} slug={post.slug} />
      ))}
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
