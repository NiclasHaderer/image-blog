import { PostFileMetadata, PostMetadata } from '@/models/post.model';
import path from 'node:path';
import { PostConstants } from './post-constants';
import fs from 'node:fs';
import { getItemsIn } from '@/utils/file';
import matter from 'gray-matter';
import { ImageOptimizer } from './image-optimizer';
import { parseWith } from '@/utils/validation';
import slugify from 'slugify';

const parsePostFile = async (postFile: string): Promise<PostFileMetadata> => {
  if (!fs.existsSync(postFile)) {
    throw new Error(`Post file ${postFile} does not exist!`);
  }

  const fileContents = await fs.promises.readFile(path.join(postFile), 'utf8');
  const { data } = matter(fileContents);

  if (Object.keys(data).length === 0) {
    throw new Error('No metadata found in post.mdx. Make sure that the file starts with a metadata block!');
  }

  return parseWith(data, PostFileMetadata, {
    file: postFile,
  });
};

const getChildPosts = async (parentPostFolder: string): Promise<string[]> => {
  const items = await getItemsIn(parentPostFolder, 'folder');

  // Ignore the images folder
  return items.filter((item) => path.basename(item) !== PostConstants.ImagesFolder);
};

const collectMetadata = async (postDirectory: string): Promise<Omit<PostMetadata, 'children'>> => {
  const postPath = path.join(postDirectory, PostConstants.PostFilename);
  const postMetadata = await parsePostFile(postPath);

  return {
    ...postMetadata,
    slug: slugify(postMetadata.title, { lower: true }),
    postPath,
    postDirectory,
    images: await ImageOptimizer.getImagesMetadata(path.join(postDirectory, PostConstants.ImagesFolder)),
    modifiedAt: await fs.promises.stat(postPath).then((s) => s.mtimeMs),
  };
};

const getModifiedAt = (posts: PostMetadata[]): number => {
  let newest = Number.MIN_VALUE;

  for (const post of posts) {
    newest = Math.max(newest, post.modifiedAt);
    newest = Math.max(newest, getModifiedAt(post.children));
  }

  return newest;
};

const collect = async (postDirectory: string): Promise<PostMetadata> => {
  const post = await collectMetadata(postDirectory);
  const childPostsFolder = await getChildPosts(postDirectory);
  const childPosts = await Promise.all(childPostsFolder.map((childPost) => collect(childPost)));

  return {
    ...post,
    children: childPosts,
    modifiedAt: Math.max(getModifiedAt(childPosts), post.modifiedAt),
  };
};

export const PostCollector = {
  collect,
};
