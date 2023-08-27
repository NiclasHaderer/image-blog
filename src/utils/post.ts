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

export const getPost = async (
  groupName: string,
  postName: string,
): Promise<
  CompiledPost & {
    group: { slug: string; title: string };
  }
> => {
  const post = await parseFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${postName}/${PostConstants.CompiledPostMetadataFilename}`,
    CompiledPost,
  );

  const group = await getPostGroup(groupName);

  return {
    ...JSON.parse(JSON.stringify(post)),
    group: {
      slug: group.slug,
      title: group.title,
    },
  };
};

export const getPostGroupUrls = async () => {
  const postGroups = await getPostGroups();
  return postGroups.map((group) => ({
    label: group.title,
    href: `/${group.slug}`,
  }));
};

export const getPostContent = async (groupName: string, postName: string): Promise<MDXRemoteSerializeResult> => {
  const content = await fs.promises.readFile(
    `${PostPreferences.CompiledPostsDir}/${groupName}/${postName}/${PostConstants.CompiledPostFilename}`,
    'utf-8',
  );
  return JSON.parse(content) as MDXRemoteSerializeResult;
};

export const getAllPosts = async (): Promise<Awaited<ReturnType<typeof getPost>>[]> => {
  const postGroups = await getPostGroups();
  const all = postGroups.flatMap((group) => Object.values(group.posts).map((post) => getPost(group.slug, post.slug)));
  return Promise.all(all);
};
