import React, { FC, Fragment } from 'react';
import { CompiledChildPost } from '@/models/post.model';
import Link from 'next/link';
import { Image } from '@/components/image';
import { getImageProps } from '@/utils/image-props';
import { Divider } from '@/components/divider';

export const ElegantPreview: FC<CompiledChildPost & { parentPosts: string[] }> = ({
  description,
  title,
  images,
  headerImage,
  slug,
  parentPosts,
  capitalizeTitle,
}) => {
  return (
    <Link href={[...parentPosts, slug].join('/')}>
      <div className="mb-2 flex items-stretch justify-center rounded-2xl py-2 sm:p-2">
        <div className="flex min-w-2/3 max-w-2/3 flex-wrap items-center pr-1 md:min-w-1/2 md:max-w-1/2 md:pr-3">
          <div className="mx-auto text-center">
            <Divider />
            <div className="p-1 md:leading-8 lg:px-2 xl:px-3">
              <h2 className={`my-1 line-clamp-1 text-xl font-normal ${capitalizeTitle ? 'uppercase' : ''}`}>{title}</h2>
              {description && <p className="my-1 line-clamp-1">{description}</p>}
            </div>
            <Divider />
          </div>
        </div>
        <div className="flex min-w-1/3 max-w-1/3 items-center pl-1 md:min-w-1/4 md:max-w-1/4 lg:min-w-1/5 lg:max-w-1/5 xl:min-w-1/6 xl:max-w-1/6 2xl:min-w-1/7 2xl:max-w-1/7">
          <Image
            className="w-full overflow-hidden rounded-xl"
            image={getImageProps<string>(images, [...parentPosts, slug].join('/'))(headerImage)}
            alt={`Header image: ${title}`}
          />
        </div>
      </div>
    </Link>
  );
};

export const ElegantList: FC<{ posts: CompiledChildPost[]; parentPosts: string[] }> = ({ posts, parentPosts }) => {
  return (
    <>
      <h3 className="pb-1 uppercase">Recent</h3>

      {posts.map((post, i) => (
        <Fragment key={i}>
          <ElegantPreview key={i} {...post} parentPosts={parentPosts} />
        </Fragment>
      ))}
    </>
  );
};
