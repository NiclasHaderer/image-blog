import { CompiledPostGroup, PostGroup } from '@/models/raw-post';
import path from 'node:path';
import { PostConstants } from './post-constants';
import { PostPreferences } from '@/preferences';
import fs from 'node:fs';
import { ensureDir, parseFile } from '@/utils/file';
import { PostsCompiler } from './posts-compiler';

const getExistingPostGroup = async (outputDir: string) => {
  const metadataPath = path.join(outputDir, PostConstants.CompiledPostGroupMetadataFilename);
  if (!fs.existsSync(metadataPath)) return undefined;
  const metadata = await parseFile(metadataPath, CompiledPostGroup, 'safe');
  if (metadata.success) {
    return metadata.data;
  }
  return undefined;
};

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
  await fs.promises.writeFile(metadataPath, JSON.stringify(compiledPostGroup));
};

const compile = async (postGroup: PostGroup) => {
  const postGroupDir = path.join(PostPreferences.CompiledPostsDir, postGroup.slug);
  let existingPostGroup = await getExistingPostGroup(postGroupDir);
  if (!existingPostGroup) {
    await _compile(postGroup, postGroupDir);
  } else if (existingPostGroup.modifiedAt < postGroup.modifiedAt) {
    // Check if the post-group was modified
    await _compile(postGroup, postGroupDir);
  }

  // Compile all posts
  await Promise.all(postGroup.posts.map(async (post) => PostsCompiler.compile(post, postGroupDir)));
};

export const PostGroupCompiler = {
  compile,
};
