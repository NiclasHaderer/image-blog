import path from 'node:path';
import fs from 'node:fs';

const getPostsFolder = (): string => {
  let folder = './posts';
  if (process.env.POSTS_FOLDER) {
    folder = process.env.POSTS_FOLDER;
  }

  // Resolve the absolute path to the posts folder
  folder = path.resolve(folder);

  // Make sure that the folder exists
  if (!fs.existsSync(folder)) {
    throw new Error(`The post group folder ${folder} does not exist!`);
  }
  return folder;
};

const getCompiledPostsFolder = (): string => {
  let folder = './compiled-posts';
  if (process.env.COMPILED_POSTS_FOLDER) {
    folder = process.env.COMPILED_POSTS_FOLDER;
  }

  // Resolve the absolute path to the compiled-posts folder
  folder = path.resolve(folder);

  // Make sure that the folder exists
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder;
};

export const PostPreferences = {
  PostGroupDir: getPostsFolder(),
  CompiledPostsDir: getCompiledPostsFolder(),
} as const;
