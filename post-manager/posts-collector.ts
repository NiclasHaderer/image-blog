import { PostFileMetadata, PostMetadata } from '@/models/post.model';
import path from 'node:path';
import { PostConstants } from './post-constants';
import fs from 'node:fs';
import { getItemsIn } from '@/utils/file';
import matter from 'gray-matter';
import { ImageOptimizer } from './image-optimizer';
import { parseWith } from '@/utils/validation';
import slugify from 'slugify';
import { areUniqueBy, mapUnique } from './utils/list';
import { PostUserError } from './user-error';

const parsePostFile = async (postFile: string): Promise<PostFileMetadata> => {
  if (!fs.existsSync(postFile)) {
    console.error(`Post file ${postFile} does not exist!`);
    throw new PostUserError();
  }

  const fileContents = await fs.promises.readFile(path.join(postFile), 'utf8');
  const { data } = matter(fileContents);

  if (Object.keys(data).length === 0) {
    console.error(`No metadata found in post file ${postFile}! Make sure that the file starts with a metadata block!`);
    throw new PostUserError();
  }

  const parsingResult = parseWith(data, PostFileMetadata, {
    file: postFile,
    safety: 'safe',
  });

  if (!parsingResult.success) {
    console.error(`Failed to parse post file ${postFile}!`);
    console.error(JSON.stringify(parsingResult.issues, null, 2));
    throw new PostUserError();
  }
  return parsingResult.data;
};

const getChildPosts = async (parentPostFolder: string): Promise<string[]> => {
  const items = await getItemsIn(parentPostFolder, 'folder');

  // Ignore the images folder
  return items.filter((item) => path.basename(item) !== PostConstants.ImagesFolder);
};

const collectMetadata = async (postDirectory: string): Promise<Omit<PostMetadata, 'childPosts'>> => {
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
    newest = Math.max(newest, getModifiedAt(post.childPosts));
  }

  return newest;
};

const collect = async (postDirectory: string): Promise<PostMetadata> => {
  const post = await collectMetadata(postDirectory);
  const childPostsFolder = await getChildPosts(postDirectory);
  const childPosts = await Promise.all(childPostsFolder.map((childPost) => collect(childPost)));
  const duplicatePosts = areUniqueBy(childPosts, (post) => post.slug);
  if (duplicatePosts) {
    console.error(`Duplicate posts found: ${mapUnique(duplicatePosts, (post) => post.slug).join(', ')}`);
    console.error("Make sure that the 'title' field is unique for each post inside a post-group!");
    console.error(
      `The duplicate posts are located in the following folders: \n\n${duplicatePosts
        .map((post) => post.postDirectory)
        .join(',\n')}`,
    );
    throw new PostUserError();
  }

  return {
    ...post,
    childPosts: childPosts,
    modifiedAt: Math.max(getModifiedAt(childPosts), post.modifiedAt),
  };
};

export const PostCollector = {
  collect,
};
