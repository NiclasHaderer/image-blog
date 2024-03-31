import React, { FC, ReactNode } from 'react';
import { DetailedCompiledPost } from '@/models/post.model';
import { PostList } from '@/components/preview/post-preview';

export const WithChildView: FC<{
  post: DetailedCompiledPost;
  parentPosts: string[];
  children: ReactNode;
}> = ({ post, parentPosts, children }) => {
  const ListView = {
    blog: PostList,
  }[post.childPostLayout];

  return (
    <>
      {post.childPostPosition === 'top' && <ListView posts={post.childPosts} parentPosts={parentPosts} />}

      {children}

      {post.childPostPosition === 'bottom' && <ListView posts={post.childPosts} parentPosts={parentPosts} />}
    </>
  );
};
