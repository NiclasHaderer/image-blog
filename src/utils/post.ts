import { parseFile } from '../../post-manager/utils/file';
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

  return parseFile(postPath, CompiledPost);
};

export const getPostChildren = async (...parentPosts: string[]): Promise<CompiledPost[]> => {
  const postPath = path.join(
    PostPreferences.CompiledPostsRootDir,
    ...parentPosts,
    PostConstants.CompiledPostMetadataFilename,
  );

  const post = await parseFile(postPath, CompiledPost);
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
): Promise<
  {
    slug?: string[];
  }[]
> => {
  if (!root) {
    root = await getPost();
  }

  const paths: { slug?: string[] }[] = [];
  for (const post of root.childPosts) {
    paths.push({
      slug: [...base, post.slug],
      ...(await getAllPossiblePaths(post, [...base, post.slug])),
    });
  }

  return paths;
};
