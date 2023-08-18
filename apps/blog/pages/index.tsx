import { PostCard } from '../components/post-card';
import { getPosts, ListedPost } from '../utils/posts';

export default function Home({ posts }: { posts: ListedPost[] }) {
  return (
    <div>
      <h1 className="mt-24 mb-12 font-bold text-3xl">Latest Posts</h1>
      {posts.map((post) => (
        <PostCard
          image={post.data.image}
          tags={post.data.tags}
          key={post.slug}
          title={post.data.title}
          date={post.data.date}
          description={post.data.description}
          slug={post.slug}
        />
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
