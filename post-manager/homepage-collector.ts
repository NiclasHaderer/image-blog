import { PostPreferences } from '@/preferences';
import { PostConstants } from './post-constants';
import path from 'node:path';
import fs from 'node:fs';
import { parseFile } from '@/utils/file';
import { HomepageSettings, HomepageSettingsMetadata } from '@/models/homepage-settings';
import { ImageOptimizer } from './image-optimizer';

const collect = async (): Promise<HomepageSettings> => {
  const homepageSettingsPath = path.join(PostPreferences.PostGroupDir, PostConstants.HomepageSettingsFilename);
  if (!fs.existsSync(homepageSettingsPath)) {
    throw new Error(`The homepage settings file ${homepageSettingsPath} does not exist!`);
  }

  const settings = await parseFile(homepageSettingsPath, HomepageSettingsMetadata);

  // Find images for the homepage
  const imagesPath = path.join(PostPreferences.PostGroupDir, PostConstants.ImagesFolder);
  return {
    ...settings,
    images: await ImageOptimizer.getImagesMetadata(imagesPath),
  };
};

export const HomePageCollector = {
  collect,
};
