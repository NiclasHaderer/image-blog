import { FC, Fragment, useEffect, useState } from 'react';
import { getImageProps } from '@/utils/image-props';
import { Image } from '@/components/image';
import Link from 'next/link';
import { CompiledPost } from '@/models/post.model';

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

export const PostPreview: FC<CompiledPost & { parentPosts: string[] }> = ({
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
    <Link href={[...parentPosts, slug].join('/')} className="drop-shadow-sm transition-all hover:drop-shadow-md">
      <div className="group mb-2 flex flex-col-reverse items-stretch rounded-2xl bg-white p-2 transition-colors md:flex-row">
        <div className="flex-grow pr-2 pt-1 md:pt-0">
          <h2 className={`text-xl font-normal ${capitalizeTitle ? 'uppercase' : ''}`}>{title}</h2>
          {date && <time className="italic text-gray">{formattedDate}</time>}
          {description && <p className="line-clamp-3 md:line-clamp-4">{description}</p>}
        </div>
        <div className="flex w-full items-center pl-1 md:w-1/3 md:min-w-1/3">
          <Image
            className="h-[10rem] w-full overflow-hidden rounded-xl"
            image={getImageProps<string>(images, [...parentPosts, slug].join('/'))(headerImage)}
            alt={`Header image: ${title}`}
          />
        </div>
      </div>
    </Link>
  );
};

export const PostList: FC<{ posts: CompiledPost[]; parentPosts: string[] }> = ({ posts, parentPosts }) => {
  return (
    <>
      {posts.map((post, i, arr) => (
        <Fragment key={i}>
          <PostPreview key={i} {...post} parentPosts={parentPosts} />
        </Fragment>
      ))}
    </>
  );
};
