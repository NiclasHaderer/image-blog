import path from 'node:path';
import fs from 'node:fs';
import { getItemsIn, parseFile } from '@/utils/file';
import { PostConstants } from './post-constants';
import slugify from 'slugify';
import { PostCollector } from './posts-collector';
import { PostPreferences } from '@/preferences';
import { PostGroup, PostGroupMetadata } from '@/models/post-group.model';

const getPostGroupMetadata = async (postsFolder: string): Promise<PostGroupMetadata[]> => {
  const postGroupFolders = await getItemsIn(postsFolder, 'folder');

  const metadata: PostGroupMetadata[] = [];
  // Check if the post-group folder has a `metadata.json` file and if yes, read it
  for (const postFolder of postGroupFolders) {
    const metadataFile = path.join(postFolder, PostConstants.PostGroupMetadataFilename);
    if (!fs.existsSync(metadataFile)) {
      console.error(
        `The post-group folder ${postFolder} does not contain a ${PostConstants.PostGroupMetadataFilename} file!`,
      );
      continue;
    }

    const fileContents = await parseFile(metadataFile, PostGroupMetadata.omit(['folderPath', 'slug', 'modifiedAt']));

    metadata.push({
      ...fileContents,
      folderPath: postFolder,
      slug: slugify(fileContents.title, { lower: true }),
      modifiedAt: await fs.promises.stat(metadataFile).then((stats) => stats.mtimeMs),
    });
  }
  return metadata;
};

const collect = async (): Promise<PostGroup[]> => {
  const postGroupMetadata = await getPostGroupMetadata(PostPreferences.PostGroupDir);
  return await Promise.all(
    postGroupMetadata.map(
      async (postGroup): Promise<PostGroup> => ({
        ...postGroup,
        posts: await PostCollector.collect(postGroup),
      }),
    ),
  );
};

export const PostGroupCollector = {
  collect,
};
