import { parseFile } from './file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import { CompiledPost, PostMetadata } from '@/models/post.model';
import path from 'node:path';

export const getPost = async (...parentPosts: string[]): Promise<CompiledPost> => {
  const postPath = path.join(
    PostPreferences.CompiledPostsRootDir,
    ...parentPosts,
    PostConstants.CompiledPostMetadataFilename,
  );

  return JSON.parse(JSON.stringify(await parseFile(postPath, CompiledPost)));
};

export const getPostChildren = async (...parentPosts: string[]): Promise<CompiledPost[]> => {
  const post = await getPost(...parentPosts);
  return Promise.all(post.childPosts.map((child) => getPost(...parentPosts, child.slug)));
};

interface NavigationItem {
  label: string;
  href: string;
  slug: string;
  children: NavigationItem[];
}

export const getNavigation = async (root?: Omit<PostMetadata, 'images'>, base?: string): Promise<NavigationItem[]> => {
  if (!root) {
    root = await getPost();
  }

  const navigation: NavigationItem[] = [];
  for (const post of root.childPosts) {
    navigation.push({
      label: post.title,
      slug: post.slug,
      href: path.join(base ?? '', post.slug),
      children: await getNavigation(post, path.join(base ?? '', post.slug)),
    });
  }

  return navigation;
};

export const getAllPossiblePaths = async (
  root?: Omit<PostMetadata, 'images'>,
  base: string[] = [],
): Promise<{ slug?: string[] }[]> => {
  if (!root) {
    root = await getPost();
  }

  const paths: { slug?: string[] }[] = [];
  for (const post of root.childPosts) {
    const children = await getAllPossiblePaths(post, [...base, post.slug]);
    paths.push({ slug: [...base, post.slug] }, ...children);
  }

  if (base.length === 0) {
    paths.push({
      slug: [],
    });
  }

  return paths;
};
