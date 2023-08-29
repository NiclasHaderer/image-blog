import { PostMetadata } from '@/models/post.model';
import fs from 'node:fs';
import { zip } from '@/utils/list';
import path from 'node:path';
import { ensureDir } from '@/utils/file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import { CompiledPostGroup } from '@/models/post-group.model';

export const copyImages = async (postGroups: CompiledPostGroup[]) => {
  await executeImageOperation(postGroups, async (postGroup, post, imagesPath, destination) => {
    await fs.promises.cp(imagesPath, destination, { recursive: true });
  });
};

export const symlinkImages = async (postGroups: CompiledPostGroup[]) => {
  await executeImageOperation(postGroups, async (postGroup, post, imagesPath, destination) => {
    await fs.promises.symlink(imagesPath, destination);
  });
};

const executeImageOperation = async (
  postGroups: CompiledPostGroup[],
  operation: (
    postGroup: CompiledPostGroup,
    post: PostMetadata,
    imagesPath: string,
    destination: string,
  ) => Promise<void>,
) => {
  const groupPostPairs = zip(postGroups, (group) => Object.values(group.posts));
  groupPostPairs.map(async ([group, post]) => {
    let destination = path.resolve(`public/gen-images/${group.slug}/`);
    await ensureDir(destination);
    const imagesPath = `${PostPreferences.CompiledPostsGroupDir}/${group.slug}/${post.slug}/${PostConstants.CompiledPostImagesFolder}`;
    destination = `${destination}/${post.slug}`;
    if (fs.existsSync(destination)) {
      await fs.promises.rm(destination, { recursive: true, force: true });
    }
    await operation(group, post, imagesPath, destination);
  });
};
