import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import slugify from 'slugify';
import { PostMetadata } from './post-metadata';

const assertUnique = (arr: string[]) => {
  const unique = new Set(arr).size === arr.length;
  if (!unique) {
    // get the duplicates
    const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
    throw new Error(`Duplicate items found: ${duplicates.join(', ')}`);
  }

  return true;
};

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

export const getPosts = async () => {
  const folders = await fs.promises.readdir(path.join('posts'));
  // Maks sure that the folders are really folders
  folders.forEach((folder) => {
    if (!fs.lstatSync(path.join('posts', folder)).isDirectory()) {
      throw new Error(`Post ${folder} is not a folder`);
    }
  });

  // Make sure that the folders have a post.mdx file
  folders.forEach((folder) => {
    if (!fs.existsSync(path.join('posts', folder, 'post.mdx'))) {
      throw new Error(`Post ${folder} does not have a post.mdx file`);
    }
  });

  // Load the posts
  const posts = await Promise.all(
    folders.map(async (folderName) => {
      const postData = await getPost(folderName);
      return {
        slug: slugify(postData.data.title, { lower: true }),
        fileName: folderName,
        data: postData.data,
      };
    })
  );

  // Make sure that the slugs are unique
  const slugs = posts.map((post) => post.slug);
  assertUnique(slugs);

  // Make sure that the dates are valid date-strings and sort the posts by date

  return posts
    .map((post) => {
      const dateMs = Date.parse(post.data.date);
      if (isNaN(dateMs)) {
        throw new Error(`Invalid date: ${post.data.date}`);
      }
      return [post, dateMs] as const;
    })
    .sort(([, d1], [, d2]) => d2 - d1)
    .map((post) => post[0]);
};
