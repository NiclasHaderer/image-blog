import { CompiledHomepageSettings, HomepageSettings } from '@/models/homepage-settings.model';
import { PostPreferences } from '@/preferences';
import fs from 'node:fs';
import { parseFile, saveFile } from '@/utils/file';
import path from 'node:path';
import { PostConstants } from './post-constants';
import { ImageCompiler } from './image-compiler';

export const getExistingHomepageSettings = async (path: string): Promise<CompiledHomepageSettings | undefined> => {
  if (!fs.existsSync(path)) return undefined;
  const compiled = await parseFile(path, CompiledHomepageSettings, { safety: 'safe' });
  if (compiled.success) {
    return compiled.data;
  }
  return undefined;
};

const compile = async (homepage: HomepageSettings): Promise<void> => {
  const settingsPath = path.join(PostPreferences.CompiledPostsRootDir, PostConstants.CompiledHomepageSettingsFilename);
  let existingSettings = await getExistingHomepageSettings(settingsPath);
  if (!existingSettings) {
    console.log('Compiling new homepage settings');
    existingSettings = {
      ...homepage,
      images: {},
    };
  } else if (existingSettings.modifiedAt < homepage.modifiedAt) {
    console.log('Compiling modified homepage settings');
    existingSettings = {
      ...homepage,
      images: existingSettings.images,
    };
  } else {
    console.log('Skipping homepage settings');
  }

  // Compile the images
  const imagesPath = path.join(PostPreferences.CompiledPostsRootDir, PostConstants.CompiledPostImagesFolder);
  existingSettings = {
    ...existingSettings,
    images: await ImageCompiler.compile(homepage.images, existingSettings.images, imagesPath),
  };

  await saveFile(settingsPath, existingSettings, CompiledHomepageSettings);
};

export const HomePageCompiler = {
  compile,
};
