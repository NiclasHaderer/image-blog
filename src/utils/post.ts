import { parseFile } from './file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../post-manager/post-constants';
import { CompiledChildPost, CompiledPost, DetailedCompiledPost, PostMetadata } from '@/models/post.model';
import path from 'node:path';
import { removeSensitivePaths } from '@/utils/security';

const getPost = async (...parentPosts: string[]): Promise<CompiledPost> => {
  const postPath = path.join(
    PostPreferences.CompiledPostsRootDir,
    ...parentPosts,
    PostConstants.CompiledPostMetadataFilename,
  );

  return removeSensitivePaths(await parseFile(postPath, CompiledPost));
};

export const getPostWitchChildren = async (...parentPosts: string[]): Promise<DetailedCompiledPost> => {
  const parsedPost = await getPost(...parentPosts);
  const postChildren: CompiledChildPost[] = await Promise.all(
    parsedPost.childPosts.map((child) => {
      const postPath = path.join(
        PostPreferences.CompiledPostsRootDir,
        ...parentPosts,
        child.slug,
        PostConstants.CompiledPostMetadataFilename,
      );

      return parseFile(postPath, CompiledChildPost);
    }),
  );

  return removeSensitivePaths({ ...parsedPost, childPosts: postChildren });
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
