import path from 'node:path';
import { PostConstants } from './post-constants';
import { PostPreferences } from '@/preferences';
import fs from 'node:fs';
import { ensureDir, parseFile, saveFile } from '@/utils/file';
import { PostsCompiler } from './posts-compiler';
import { CompiledPostGroup, PostGroup } from '@/models/post-group.model';

const getExistingPostGroup = async (outputDir: string) => {
  const metadataPath = path.join(outputDir, PostConstants.CompiledPostGroupMetadataFilename);
  if (!fs.existsSync(metadataPath)) return undefined;
  const metadata = await parseFile(metadataPath, CompiledPostGroup, { safety: 'safe' });
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
  await saveFile(metadataPath, compiledPostGroup, CompiledPostGroup);
};

const compile = async (postGroup: PostGroup) => {
  console.group(`PostGroup: ${postGroup.title}`);
  const postGroupDir = path.join(PostPreferences.CompiledPostsDir, postGroup.slug);
  const existingPostGroup = await getExistingPostGroup(postGroupDir);
  if (!existingPostGroup) {
    console.log(`Compiling new post-group: ${postGroup.title}`);
    await _compile(postGroup, postGroupDir);
  } else if (existingPostGroup.modifiedAt < postGroup.modifiedAt) {
    // Check if the post-group was modified
    console.log(`Compiling modified post-group: ${postGroup.title}`);
    await _compile(postGroup, postGroupDir);
  } else {
    console.log(`Skipping post-group: ${postGroup.title}`);
  }

  // Compile all posts
  await Promise.all(postGroup.posts.map(async (post) => PostsCompiler.compile(post, postGroupDir)));
  console.groupEnd();
};

export const PostGroupCompiler = {
  compile,
};
