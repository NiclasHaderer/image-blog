import path from 'node:path';
import { PostConstants } from './post-constants';
import { PostPreferences } from '@/preferences';
import fs from 'node:fs';
import { ensureDir, getItemsIn, saveFile } from '@/utils/file';
import { PostsCompiler } from './posts-compiler';
import { CompiledPostGroup, PostGroup } from '@/models/post-group.model';

const _compile = async (postGroup: PostGroup, postGroupDir: string) => {
  const metadataPath = path.join(postGroupDir, PostConstants.CompiledPostGroupMetadataFilename);
  const compiledPostGroup: CompiledPostGroup = {
    ...postGroup,
    posts: postGroup.posts.reduce(
      (acc, post) => {
        acc[post.slug] = post;
        return acc;
      },
      {} as CompiledPostGroup['posts'],
    ),
  };
  await ensureDir(postGroupDir);
  await saveFile(metadataPath, compiledPostGroup, CompiledPostGroup);
};

const compile = async (postGroup: PostGroup) => {
  console.log(`Compiling post-group: ${postGroup.title}`);
  const postGroupDir = path.join(PostPreferences.CompiledPostsDir, postGroup.slug);
  await _compile(postGroup, postGroupDir);

  // Compile all posts
  await Promise.all(postGroup.posts.map(async (post) => PostsCompiler.compile(post, postGroupDir)));

  // Remove posts that were deleted
  const existingPosts = await getItemsIn(postGroupDir, 'folder');
  const deletedPosts = existingPosts.filter((existingPost) => {
    const existingPostSlug = path.basename(existingPost);
    return !postGroup.posts.find((post) => post.slug === existingPostSlug);
  });
  for (const deletedPost of deletedPosts) {
    console.log(`Deleting post: ${deletedPost}`);
    await fs.promises.rm(deletedPost, { recursive: true, force: true });
  }
};

export const PostGroupCompiler = {
  compile,
};
