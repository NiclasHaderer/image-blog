import path from 'node:path';
import { PostConstants } from './post-constants';
import { PostPreferences } from '@/preferences';
import fs from 'node:fs';
import { ensureDir, getItemsIn, parseFile, saveFile } from '@/utils/file';
import { PostsCompiler } from './posts-compiler';
import { CompiledPostGroup, PostGroup } from '@/models/post-group.model';
import { ImageCompiler } from './image-compiler';

const getExistingPostGroup = async (outputDir: string) => {
  const metadataPath = path.join(outputDir, PostConstants.CompiledPostGroupMetadataFilename);
  if (!fs.existsSync(metadataPath)) return undefined;
  try {
    return await parseFile(metadataPath, CompiledPostGroup);
  } catch {
    return undefined;
  }
};

const _compile = async (postGroup: PostGroup, postGroupDir: string) => {
  return {
    ...postGroup,
    posts: postGroup.posts.reduce(
      (acc, post) => {
        acc[post.slug] = post;
        return acc;
      },
      {} as CompiledPostGroup['posts'],
    ),
  };
};

const compile = async (postGroup: PostGroup) => {
  const postGroupDir = path.join(PostPreferences.CompiledPostsRootDir, PostConstants.PostGroupsFolder, postGroup.slug);
  await ensureDir(postGroupDir);

  let newPostGroup = await getExistingPostGroup(postGroupDir);
  if (!newPostGroup) {
    console.log(`Compiling new post-group: ${postGroup.title}`);
    newPostGroup = {
      ...(await _compile(postGroup, postGroupDir)),
      images: {},
    };
  } else if (newPostGroup.modifiedAt < postGroup.modifiedAt) {
    console.log(`Compiling updated post-group: ${postGroup.title}`);
    newPostGroup = {
      ...(await _compile(postGroup, postGroupDir)),
      images: newPostGroup.images,
    };
  } else {
    console.log(`Skipping post-group: ${postGroup.title}`);
  }

  // Compile the post-group images
  const imagesPath = path.join(postGroupDir, PostConstants.CompiledPostImagesFolder);
  newPostGroup = {
    ...newPostGroup,
    images: await ImageCompiler.compile(postGroup.images, newPostGroup.images, imagesPath),
  };

  // Save the post-group metadata
  const metadataPath = path.join(postGroupDir, PostConstants.CompiledPostGroupMetadataFilename);
  await saveFile(metadataPath, newPostGroup, CompiledPostGroup);

  // Compile all posts
  await Promise.all(postGroup.posts.map(async (post) => PostsCompiler.compile(post, postGroupDir)));

  // Remove or other files that should not be in a post-group folder
  const otherFilesOrPosts = await getItemsIn(postGroupDir, undefined, false);
  otherFilesOrPosts
    .filter((existingPost) => {
      return (
        !postGroup.posts.some((post) => post.slug === existingPost) &&
        existingPost !== PostConstants.CompiledPostGroupMetadataFilename &&
        existingPost !== PostConstants.CompiledPostImagesFolder
      );
    })
    .forEach((deletedPost) => {
      console.log(`Deleting unused post: ${deletedPost}`);
      fs.rmSync(deletedPost, { recursive: true, force: true });
    });
};

export const PostGroupCompiler = {
  compile,
};
