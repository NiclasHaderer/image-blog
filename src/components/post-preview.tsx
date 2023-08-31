import { FC, Fragment, useEffect, useState } from 'react';
import type { CompiledPost } from '@/models/post.model';
import { isUrl } from '@/utils/string';
import { getImageProps } from '@/utils/image-props';
import { Image } from '@/components/image';
import { CompiledImages } from '@/models/image.model';
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
    <Link href={href} className="transition-all drop-shadow-sm hover:drop-shadow-md">
      <div className="group items-stretch transition-colors bg-white rounded-2xl flex flex-col-reverse md:flex-row py-2 px-2 pr-2 mb-2">
        <div className="flex-grow pr-2 pt-1 md:pt-0">
          <h2 className="text-xl my-4 font-normal">{title}</h2>
          {date && <time className="text-gray italic">{formattedDate}</time>}
          {description && <p className="mt-4 line-clamp-3 md:line-clamp-4">{description}</p>}
        </div>
        <div className="flex items-center w-full md:min-w-1/3 md:w-1/3">
          <PostPreviewImage
            className="rounded-2xl overflow-hidden w-full h-[10rem]"
            headerImage={headerImage}
            images={images}
            group={group}
            slug={slug}
            title={title}
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

const PostPreviewImage: FC<{
  headerImage: string;
  images: CompiledImages;
  group: {
    slug: string;
    title: string;
  };
  slug: string;
  title: string;
  className?: string;
}> = ({ headerImage, images, className, group, slug, title }) => {
  if (isUrl(headerImage)) {
    return (
      <div
        className={`bg-cover h-full ${className}`}
        style={{
          backgroundImage: `url(${headerImage})`,
        }}
      ></div>
    );
  }
  return (
    <Image
      className={className}
      image={getImageProps<string>(images, `${group.slug}/${slug}`)(headerImage)}
      alt={`Header image: ${title}`}
    />
  );
};
