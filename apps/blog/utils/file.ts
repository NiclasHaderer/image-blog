import fs from 'fs';

export const newestFileTime = async (files: string[]) => {
  const times = await Promise.all(files.map((file) => fs.promises.stat(file).then((stats) => stats.mtimeMs)));
  return Math.max(...times);
};
