import { CompiledPost, PostContent, PostMetadata } from '@/models/post.model';
import { PostConstants } from './post-constants';
import path from 'node:path';
import { ensureDir, parseFile, saveFile } from '@/utils/file';
import fs from 'node:fs';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { ImageCompiler } from './image-compiler';

const isProd = process.argv.includes('--prod');

const getExistingPost = async (metadataPath: string): Promise<CompiledPost | undefined> => {
  // Check if the post already exists by reading its metadata
  if (!fs.existsSync(metadataPath)) return undefined;
  try {
    return await parseFile(metadataPath, CompiledPost);
  } catch {
    return undefined;
  }
};

const serializeMarkdown = async (post: PostMetadata): Promise<PostContent> => {
  // Compile and save the post
  const postContentStr = await fs.promises.readFile(post.postPath, 'utf-8');
  const { content } = matter(postContentStr);

  return await serialize(content, {
    mdxOptions: {
      // Depending on the environment (next prod/dev), we have to enable/disable, otherwise this will result in
      // jsx not defined errors
      development: !isProd,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      remarkPlugins: [remarkGfm, remarkEmoji],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    },
  });
};

const compile = async (post: PostMetadata, outputPostDir: string, outputImagesDir: string) => {
  // Get the existing post

  const postMetadataPath = path.join(outputPostDir, PostConstants.CompiledPostMetadataFilename);
  const existingPost = await getExistingPost(postMetadataPath);
  let newPost: CompiledPost;
  if (!existingPost || existingPost.modifiedAt < post.modifiedAt || isProd) {
    // 1. The post does not exist yet
    // 2. The post was modified
    // 3. The post exists and was not modified, but we are in production mode, so we don't have to recompile it
    newPost = {
      ...post,
      content: await serializeMarkdown(post),
      images: await ImageCompiler.compile(post.images, existingPost?.images ?? {}, outputImagesDir),
    };
    console.log(`Compiled post ${post.slug}`);
  } else {
    newPost = {
      ...existingPost,
      images: await ImageCompiler.compile(post.images, existingPost.images, outputImagesDir),
    };
    console.log(`Skipped post ${post.slug}`);
  }

  // Save the post-metadata
  await ensureDir(outputPostDir);
  await saveFile(postMetadataPath, newPost, CompiledPost);

  // Compile the children
  await Promise.all(
    newPost.childPosts.map((child) =>
      compile(child, path.join(outputPostDir, child.slug), path.join(outputImagesDir, child.slug)),
    ),
  );
};

export const PostCompiler = {
  compile,
};
