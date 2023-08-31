import { FC } from 'react';
import type { CompiledPost } from '@/models/post.model';
import { isUrl } from '@/utils/string';
import { getImageProps } from '@/utils/image-props';
import { Image } from '@/components/image';
import { CompiledImages } from '@/models/image.model';

export const PostPreview: FC<
  CompiledPost & {
    group: {
      slug: string;
      title: string;
    };
  }
> = ({ title, date, description, images, group, slug, headerImage }) => {
  return (
    <div className="my-4 py-4 group transition-colors p-2 hover:bg-elevate-1 rounded-2xl flex items-center flex-col-reverse md:flex-row bg-elevate mb-2">
      <div className="flex-grow">
        <h2 className="font-bold text-2xl my-4">{title}</h2>
        {date && <time className="text-gray-400">{date}</time>}
        {description && <p className="mt-4 italic">{description}</p>}
        <div className="group-hover:underline">Read more &#8230;</div>
      </div>
      <div className="flex items-center h-[10rem] rounded-2xl overflow-hidden w-full md:min-w-1/3 md:w-1/3">
        <HeaderImage
          className="rounded-2xl overflow-hidden"
          headerImage={headerImage}
          images={images}
          group={group}
          slug={slug}
          title={title}
        />
      </div>
    </div>
  );
};

const HeaderImage: FC<{
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
        className={`bg-cover h-full w-full ${className}`}
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
