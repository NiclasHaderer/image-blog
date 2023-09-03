import React, { FC, ReactNode } from 'react';
import { CompiledPost } from '@/models/post.model';
import { PostList } from '@/components/preview/post-preview';
import { ElegantList } from '@/components/preview/elegant-preview';

export const WithChildView: FC<{
  post: CompiledPost;
  parentPosts: string[];
  childPosts: CompiledPost[];
  children: ReactNode;
}> = ({ post, parentPosts, childPosts, children }) => {
  const ListView = {
    elegant: ElegantList,
    blog: PostList,
  }[post.childPostLayout];

  return (
    <>
      {post.childPostPosition === 'top' && <ListView posts={childPosts} parentPosts={parentPosts} />}

      {children}

      {post.childPostPosition === 'bottom' && <ListView posts={childPosts} parentPosts={parentPosts} />}
    </>
  );
};
