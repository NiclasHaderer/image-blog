import { ensureDir, getItemsIn, parseFile } from '@/utils/file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import { CompiledPost, CompiledPostGroup, PostMetadata } from '@/models/raw-post';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'node:fs';
import { zip } from '@/utils/list';
import path from 'node:path';

export const getPostGroups = async (): Promise<CompiledPostGroup[]> => {
  const postGroups = await getItemsIn(PostPreferences.CompiledPostsDir, 'folder', false);
  const groups = postGroups.map(getPostGroup);
  return Promise.all(groups);
};

export const getPostGroup = async (groupName: string): Promise<CompiledPostGroup> => {
  const postGroup = await parseFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${PostConstants.CompiledPostGroupMetadataFilename}`,
    CompiledPostGroup,
  );
  return JSON.parse(JSON.stringify(postGroup)) as CompiledPostGroup;
};

export const getPost = async (groupName: string, postName: string): Promise<CompiledPost & { postSlug: string }> => {
  const post = await parseFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${postName}/${PostConstants.CompiledPostMetadataFilename}`,
    CompiledPost,
  );
  return {
    ...JSON.parse(JSON.stringify(post)),
    postSlug: groupName,
  } as CompiledPost & { postSlug: string };
};

export const getPostContent = async (groupName: string, postName: string): Promise<MDXRemoteSerializeResult> => {
  const content = await fs.promises.readFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${postName}/${PostConstants.CompiledPostFilename}`,
    'utf-8',
  );
  return JSON.parse(content) as MDXRemoteSerializeResult;
};

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
    const imagesPath = `${PostPreferences.CompiledPostsDir}/${group.slug}/${post.slug}/${PostConstants.CompiledPostImagesFolder}`;
    destination = `${destination}/${post.slug}`;
    if (fs.existsSync(destination)) {
      await fs.promises.rm(destination, { recursive: true, force: true });
    }
    await operation(group, post, imagesPath, destination);
  });
};
