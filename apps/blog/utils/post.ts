import { PostMetadata } from './post-metadata';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export const getPost = async (folder: string): Promise<{ content: string; data: PostMetadata }> => {
  const postFolder = path.join('posts', folder);
  const fileContents = await fs.promises.readFile(path.join(`${postFolder}/post.mdx`), 'utf8');
  const { data, content } = matter(fileContents);

  const coerced = PostMetadata.coerceSave(data);
  if (!coerced.success) {
    console.error(coerced.issues);
    throw new Error(`Invalid post metadata in ${folder}`);
  }

  return {
    data: PostMetadata.coerce(data),
    content,
  };
};
