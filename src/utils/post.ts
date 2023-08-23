import { PostMetadata } from '@/models/post-metadata';
import path from 'node:path';
import fs from 'node:fs';
import matter from 'gray-matter';
import { PostImagesMetadata } from '@/models/post-images-metadata';
import { getAllPostsMetadata } from '@/utils/posts';

export const getPost = async (folder: string): Promise<{ content: string; metadata: PostMetadata }> => {
  const postFolder = path.join('posts', folder);
  const fileContents = await fs.promises.readFile(path.join(`${postFolder}/post.mdx`), 'utf8');
  const { data, content } = matter(fileContents);

  if (Object.keys(data).length === 0) {
    throw new Error('No metadata found in post.mdx. Make sure that the file starts with a metadata block!');
  }

  const coerced = PostMetadata.coerceSave(data);
  if (!coerced.success) {
    console.error(coerced.issues);
    throw new Error(`Invalid post metadata in ${folder}`);
  }

  return {
    metadata: PostMetadata.coerce(data),
    content,
  };
};

export const getPostBySlug = async (slug: string): Promise<{ content: string; metadata: PostMetadata }> => {
  const posts = await getAllPostsMetadata();
  const post = posts.find((post) => post.slug === slug);
  if (!post) {
    throw new Error(`No post found with slug ${slug}`);
  }
  return getPost(post.fileName);
};

export const getPostImagesMetadata = async (folder: string): Promise<PostImagesMetadata> => {
  const publicImagesFolder = path.join('public', 'images', folder);
  const metadataFile = path.join(publicImagesFolder, 'metadata.json');
  // Check if file exists and if not, return empty metadata
  if (!fs.existsSync(metadataFile)) {
    return { imageCount: 0, imageSizes: {}, newestImageDate: 0 };
  }
  const metadataContent = await fs.promises.readFile(metadataFile, 'utf8');
  return PostImagesMetadata.coerce(JSON.parse(metadataContent));
};
