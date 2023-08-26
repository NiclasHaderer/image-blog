import { CompiledPostGroup } from '@/models/raw-post';
import { getItemsIn, parseFile } from '@/utils/file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import Link from 'next/link';

export default function Home({ postGroups }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return (
    <div>
      <h1 className="mt-24 mb-12 font-bold text-3xl">Latest Posts</h1>
      {postGroups.map(
        (post, i) => (
          <Link href={`/posts/${post.slug}`} key={i}>
            {post.title} - {post.description}
          </Link>
        ),

        // <PostCard {...post.data} key={post.slug} slug={post.slug} />
      )}
    </div>
  );
}

// TODO symlink image folders from posts in dev, copy in prod
export const getStaticProps = async () => {
  const postGroups = await getItemsIn(PostPreferences.CompiledPostsDir, 'folder');
  const postMetadata = postGroups.map(async (folder) => {
    const parsed = await parseFile(`${folder}/${PostConstants.CompiledPostGroupMetadataFilename}`, CompiledPostGroup);
    return JSON.parse(JSON.stringify(parsed));
  });
  return {
    props: {
      postGroups: await Promise.all(postMetadata),
    },
  };
};
