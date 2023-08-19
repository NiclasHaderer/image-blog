import { PostMetadata } from './post-metadata';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { PostImagesMetadata } from './post-images-metadata';

export const getPost = async (folder: string): Promise<{ content: string; metadata: PostMetadata }> => {
  const postFolder = path.join('posts', folder);
  const fileContents = await fs.promises.readFile(path.join(`${postFolder}/post.mdx`), 'utf8');
  const { data, content } = matter(fileContents);

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

export const getPostImagesMetadata = async (folder: string): Promise<PostImagesMetadata> => {
  const publicImagesFolder = path.join('public', 'images', folder);
  const metadataFile = path.join(publicImagesFolder, 'metadata.json');
  const metadataContent = await fs.promises.readFile(metadataFile, 'utf8');
  return PostImagesMetadata.coerce(JSON.parse(metadataContent));
};
