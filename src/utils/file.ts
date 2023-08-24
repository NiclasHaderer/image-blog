import { LuftInfer, LuftType } from '@luftschloss/validation';
import fs from 'node:fs';
import path from 'node:path';
import { ParsingResult } from '@luftschloss/validation/src/lib/types/base-type';

export const newestFileTime = async (files: string[]) => {
  const times = await Promise.all(files.map((file) => fs.promises.stat(file).then((stats) => stats.mtimeMs)));
  return Math.max(...times);
};

export const getItemsIn = async (folder: string, type: 'folder' | 'file') => {
  const shouldBeFolder = type === 'folder';
  const items = await fs.promises.readdir(folder);
  const isFolderLookup = await Promise.all(
    items.map((item) => fs.promises.stat(item).then((stats) => stats.isDirectory() === shouldBeFolder)),
  );
  const folders = items.filter((_, index) => isFolderLookup[index]);
  return folders.map((f) => path.join(folder, f));
};

export const parseFile = async <T extends LuftType, M extends 'safe' | 'unsafe' | undefined = undefined>(
  file: string,
  parser: T,
  mode?: M,
): Promise<M extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>> => {
  const fileContents = await fs.promises.readFile(file, 'utf-8');
  const jsonContents = JSON.parse(fileContents);
  if (mode === 'safe') {
    return parser.coerceSave(jsonContents) as M extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>;
  }
  return parser.coerce(jsonContents);
};

export const ensureDir = async (dir: string | string[], options = { recursive: true }) => {
  if (!Array.isArray(dir)) dir = [dir];
  for (const d of dir) {
    if (!fs.existsSync(d)) {
      await fs.promises.mkdir(d, options);
    }
  }
};
