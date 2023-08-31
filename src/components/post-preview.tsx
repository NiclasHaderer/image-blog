import { FC, Fragment, useEffect, useState } from 'react';
import type { CompiledPost } from '@/models/post.model';
import { getImageProps } from '@/utils/image-props';
import { Image } from '@/components/image';
import Link from 'next/link';
import { getPost } from '@/utils/post';

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

export const PostPreview: FC<
  CompiledPost & {
    group: {
      slug: string;
      title: string;
    };
    href: string;
  }
> = ({ title, date, description, images, href, group, slug, headerImage }) => {
  const formattedDate = useFormatDate(date);
  return (
    <Link href={href} className="drop-shadow-sm transition-all hover:drop-shadow-md">
      <div className="group mb-2 flex flex-col-reverse items-stretch rounded-2xl bg-white px-2 py-2 pr-2 transition-colors md:flex-row">
        <div className="flex-grow pr-2 pt-1 md:pt-0">
          <h2 className="my-4 text-xl font-normal">{title}</h2>
          {date && <time className="italic text-gray">{formattedDate}</time>}
          {description && <p className="mt-4 line-clamp-3 md:line-clamp-4">{description}</p>}
        </div>
        <div className="flex w-full items-center pl-1 md:w-1/3 md:min-w-1/3">
          <Image
            className="h-[10rem] w-full overflow-hidden rounded-xl"
            image={getImageProps<string>(images, `${group.slug}/${slug}`)(headerImage)}
            alt={`Header image: ${title}`}
          />
        </div>
      </div>
    </Link>
  );
};

export const PostList: FC<{ posts: Awaited<ReturnType<typeof getPost>>[] }> = ({ posts }) => {
  return (
    <>
      {posts.map((post, i, arr) => (
        <Fragment key={i}>
          <PostPreview key={i} href={`/${post.group.slug}/${post.slug}`} {...post} />
          {i !== arr.length - 1 && (
            <div className="px-[20%] pb-2 md:hidden">
              <hr className="border-elevate-2" />
            </div>
          )}
        </Fragment>
      ))}
    </>
  );
};
