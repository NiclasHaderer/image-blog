import { getItemsIn, parseFile } from '@/utils/file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import { CompiledPost } from '@/models/post.model';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import fs from 'node:fs';
import { CompiledPostGroup } from '@/models/post-group.model';
import path from 'node:path';

export const getPostGroups = async (): Promise<CompiledPostGroup[]> => {
  const postGroups = await getItemsIn(
    path.join(PostPreferences.CompiledPostsRootDir, PostConstants.PostGroupsFolder),
    'folder',
    false,
  );
  const groups = postGroups.map(getPostGroup);
  return Promise.all(groups).then((groups) => groups.sort((a, b) => a.index - b.index));
};

export const getPostGroup = async (groupName: string): Promise<CompiledPostGroup> => {
  const postGroup = await parseFile(
    path.join(
      PostPreferences.CompiledPostsRootDir,
      PostConstants.PostGroupsFolder,
      groupName,
      PostConstants.CompiledPostGroupMetadataFilename,
    ),
    CompiledPostGroup,
  );
  return JSON.parse(JSON.stringify(postGroup)) as CompiledPostGroup;
};

export const getPostsOfGroup = async (
  groupName: string,
): Promise<
  (CompiledPost & {
    group: {
      slug: string;
      title: string;
    };
  })[]
> => {
  const group = await getPostGroup(groupName);
  const posts = Object.values(group.posts).map((post) => getPost(groupName, post.slug));
  const postsAwaited = await Promise.all(posts);
  return postsAwaited.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
};

export const getPost = async (
  groupName: string,
  postName: string,
): Promise<
  CompiledPost & {
    group: {
      slug: string;
      title: string;
    };
  }
> => {
  const post = await parseFile(
    path.join(
      PostPreferences.CompiledPostsRootDir,
      PostConstants.PostGroupsFolder,
      groupName,
      postName,
      PostConstants.CompiledPostMetadataFilename,
    ),
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
    path.join(
      PostPreferences.CompiledPostsRootDir,
      PostConstants.PostGroupsFolder,
      groupName,
      postName,
      PostConstants.CompiledPostFilename,
    ),
    'utf-8',
  );
  return JSON.parse(content) as MDXRemoteSerializeResult;
};

export const getAllPosts = async (
  excludeNotFeatured: boolean = true,
): Promise<Awaited<ReturnType<typeof getPost>>[]> => {
  const postGroups = await getPostGroups();
  const all = postGroups.flatMap((group) => Object.values(group.posts).map((post) => getPost(group.slug, post.slug)));
  const awaitedAll = await Promise.all(all);

  return awaitedAll
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .filter((post) => post.featureOnHomepage || !excludeNotFeatured);
};
