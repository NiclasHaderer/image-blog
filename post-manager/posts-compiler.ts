import { CompiledPost, Post, PostContent } from '@/models/post.model';
import { PostConstants } from './post-constants';
import path from 'node:path';
import { ensureDir, parseFile, saveFile } from '@/utils/file';
import fs from 'node:fs';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { ImageCompiler } from './image-compiler';
import matter from 'gray-matter';

const isProd = process.argv.includes('--prod');

const getExistingPost = async (metadataPath: string): Promise<CompiledPost | undefined> => {
  // Check if the post already exists by reading its metadata
  if (!fs.existsSync(metadataPath)) return undefined;
  const metadata = await parseFile(metadataPath, CompiledPost, { safety: 'safe' });
  if (metadata.success) {
    return metadata.data;
  }
  return undefined;
};

const compilePost = async (post: Post, postDir: string) => {
  // Compile and save the post
  const postContentStr = await fs.promises.readFile(post.postPath, 'utf-8');
  const { content } = matter(postContentStr);

  const serializedPost = await serialize(content, {
    mdxOptions: {
      // Depending on the environment (next prod/dev), we have to enable/disable, otherwise this will result in
      // jsx not defined errors
      development: !isProd,
      remarkPlugins: [remarkGfm, remarkEmoji],
    },
  });
  const postPath = path.join(postDir, PostConstants.CompiledPostFilename);
  await saveFile(postPath, serializedPost, PostContent);
};

const compile = async (post: Post, outputDir: string) => {
  // Create the folders necessary for the post
  const postDir = path.join(outputDir, post.slug);
  const metadataPath = path.join(postDir, PostConstants.CompiledPostMetadataFilename);

  await ensureDir(postDir);
  let existingPost = await getExistingPost(metadataPath);
  if (!existingPost) {
    console.log(`Compiling new post: ${post.title}`);
    await compilePost(post, postDir);
    existingPost = { ...post, images: {} };
  } else if (existingPost.modifiedAt < post.modifiedAt) {
    console.log(`Compiling modified post: ${post.title}`);
    await compilePost(post, postDir);
    existingPost = { ...post, images: existingPost.images };
  } else if (isProd) {
    console.log(`Compiling post in prod: ${post.title}`);
    await compilePost(post, postDir);
    existingPost = { ...post, images: existingPost.images };
  } else {
    console.log(`Skipping post: ${post.title}`);
  }

  // Write the images
  existingPost = {
    ...existingPost,
    images: await ImageCompiler.compile(
      post.images,
      existingPost.images,
      path.join(postDir, PostConstants.ImagesFolder),
    ),
  };

  // Save the post-metadata
  await saveFile(metadataPath, existingPost, CompiledPost);
};

export const PostsCompiler = {
  compile,
};
