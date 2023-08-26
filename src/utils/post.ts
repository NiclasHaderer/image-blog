import { getItemsIn, parseFile } from '@/utils/file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import { CompiledPost, CompiledPostGroup } from '@/models/raw-post';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'node:fs';

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

export const getPost = async (groupName: string, postName: string): Promise<CompiledPost> => {
  const post = await parseFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${postName}/${PostConstants.CompiledPostMetadataFilename}`,
    CompiledPost,
  );
  return JSON.parse(JSON.stringify(post)) as CompiledPost;
};

export const getPostContent = async (groupName: string, postName: string): Promise<MDXRemoteSerializeResult> => {
  const content = await fs.promises.readFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${postName}/${PostConstants.CompiledPostFilename}`,
    'utf-8',
  );
  return JSON.parse(content) as MDXRemoteSerializeResult;
};
