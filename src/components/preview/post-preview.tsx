import React, { FC, Fragment, useEffect, useState } from 'react';
import { getImageProps } from '@/utils/image-props';
import { Image } from '@/components/image';
import Link from 'next/link';
import { CompiledChildPost } from '@/models/post.model';

export const useFormatDate = (date: string) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    let locales: string;
    // Get the locale string based on the user's browser
    if (typeof window !== 'undefined') {
      locales = navigator.languages.find((l) => l.includes('-')) || navigator.language;
    } else {
      locales = 'en-US';
    }
    return d.toLocaleDateString(locales, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    setFormattedDate(formatDate(date));
  }, [date]);

  const [formattedDate, setFormattedDate] = useState(
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  );
  return formattedDate;
};

export const PostPreview: FC<CompiledChildPost & { parentPosts: string[] }> = ({
  title,
  date,
  description,
  images,
  slug,
  headerImage,
  parentPosts,
  capitalizeTitle,
}) => {
  const formattedDate = useFormatDate(date);
  return (
    <Link
      href={[...parentPosts, slug].join('/')}
      className="flex justify-center drop-shadow-sm transition-all hover:drop-shadow-md"
    >
      <div className="group mb-2 flex flex-col-reverse items-stretch rounded-2xl bg-white p-2 transition-colors md:flex-row lg:max-w-11/12 2xl:max-w-5/6">
        <div className="flex-grow pr-2 pt-1 md:pt-0">
          <h2 className={`text-xl font-normal ${capitalizeTitle ? 'uppercase' : ''}`}>{title}</h2>
          {date && <time className="italic text-gray">{formattedDate}</time>}
          {description && <p className="line-clamp-3 md:line-clamp-4">{description}</p>}
        </div>
        <div className="flex w-full items-center pl-1 md:w-1/3 md:min-w-1/3 lg:min-w-1/4 lg:max-w-1/4">
          <Image
            sizes="100vw, (min-width:768px) 33vw, (min-width: 1024px) 20w , (min-width: 1280px) 16vw, (min-width: 1536px) 14vw"
            className="max-h-[10rem] w-full overflow-hidden rounded-xl md:h-auto"
            image={getImageProps<string>(images, [...parentPosts, slug].join('/'))(headerImage)}
            alt={`Header image: ${title}`}
          />
        </div>
      </div>
    </Link>
  );
};

export const PostList: FC<{ posts: CompiledChildPost[]; parentPosts: string[] }> = ({ posts, parentPosts }) => {
  return (
    <>
      <h3 className="pb-1 uppercase">Recent</h3>

      {posts.map((post, i, arr) => (
        <Fragment key={i}>
          <PostPreview key={i} {...post} parentPosts={parentPosts} />
        </Fragment>
      ))}
    </>
  );
};
