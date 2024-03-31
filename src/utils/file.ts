import { LuftInfer, LuftObject, ParsingResult } from '@luftschloss/validation';
import fs from 'node:fs';
import path from 'node:path';
import { parseWith } from '@/utils/validation';

export const getItemsIn = async (folder: string, type?: 'folder' | 'file' | undefined, makeAbsolute = true) => {
  const items = await fs.promises.readdir(folder);
  const isFolderLookup = await Promise.all(
    items.map((item) =>
      fs.promises.stat(path.join(folder, item)).then((stats) => {
        if (type === 'folder') return stats.isDirectory();
        if (type === 'file') return !stats.isDirectory();
        return true;
      }),
    ),
  );
  const folders = items.filter((_, index) => isFolderLookup[index]);
  if (!makeAbsolute) return folders;
  return folders.map((f) => path.join(folder, f));
};

export const parseFile = async <T extends LuftObject<any>, S extends 'safe' | 'unsafe' | undefined = undefined>(
  file: string,
  parser: T,
  {
    mode,
    safety,
    ignoreUnknownKeys,
  }: {
    mode?: 'validate' | 'coerce';
    safety?: S;
    ignoreUnknownKeys: boolean;
  },
): Promise<S extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>> => {
  const fileContents = await fs.promises.readFile(file, 'utf-8');
  let jsonContents;
  try {
    jsonContents = JSON.parse(fileContents);
  } catch (e) {
    console.error(`File ${file} is not a valid JSON file!`);
    throw e;
  }
  return parseWith(jsonContents, parser, { file, safety, mode, ignoreUnknownKeys: ignoreUnknownKeys });
};

export const saveFile = async <T extends LuftObject<any>, D extends LuftInfer<T>>(file: string, data: D, parser: T) => {
  const parsed = parseWith(data, parser, { file, safety: 'unsafe', mode: 'validate', ignoreUnknownKeys: false });
  await fs.promises.writeFile(file, JSON.stringify(parsed));
};

export const ensureDir = async (dir: string | string[], options = { recursive: true }) => {
  if (!Array.isArray(dir)) dir = [dir];
  for (const d of dir) {
    if (!fs.existsSync(d)) {
      await fs.promises.mkdir(d, options);
    }
  }
};
