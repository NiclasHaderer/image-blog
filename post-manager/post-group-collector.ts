import path from 'node:path';
import fs from 'node:fs';
import { getItemsIn, parseFile } from '@/utils/file';
import { PostConstants } from './post-constants';
import slugify from 'slugify';
import { PostCollector } from './posts-collector';
import { PostPreferences } from '@/preferences';
import { PostGroup, PostGroupMetadata } from '@/models/post-group.model';
import { ImageOptimizer } from './image-optimizer';

const getPostGroupMetadata = async (postsFolder: string): Promise<PostGroupMetadata[]> => {
  const postGroupFolders = await getItemsIn(postsFolder, 'folder');

  const metadata: PostGroupMetadata[] = [];
  // Check if the post-group folder has a `metadata.json` file and if yes, read it
  for (const groupFolder of postGroupFolders) {
    const metadataFile = path.join(groupFolder, PostConstants.PostGroupMetadataFilename);
    if (!fs.existsSync(metadataFile)) {
      console.error(
        `The post-group folder ${groupFolder} does not contain a ${PostConstants.PostGroupMetadataFilename} file!`,
      );
      continue;
    }

    const fileContents = await parseFile(metadataFile, PostGroupMetadata.omit(['folderPath', 'slug', 'modifiedAt']));

    metadata.push({
      ...fileContents,
      folderPath: groupFolder,
      slug: slugify(fileContents.title, { lower: true }),
      modifiedAt: await fs.promises.stat(metadataFile).then((stats) => stats.mtimeMs),
    });
  }
  return metadata;
};

const collect = async (): Promise<PostGroup[]> => {
  const postGroupFolder = path.join(PostPreferences.PostRootDir, PostConstants.PostGroupsFolder);
  const postGroupMetadata = await getPostGroupMetadata(postGroupFolder);

  const postGroups = postGroupMetadata.map(async (postGroup): Promise<PostGroup> => {
    // Read images metadata
    const imagesPath = path.join(postGroup.folderPath, PostConstants.ImagesFolder);
    return {
      ...postGroup,
      posts: await PostCollector.collect(postGroup),
      images: await ImageOptimizer.getImagesMetadata(imagesPath),
    };
  });

  return await Promise.all(postGroups);
};

export const PostGroupCollector = {
  collect,
};
