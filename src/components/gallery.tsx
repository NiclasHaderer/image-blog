import { FC } from 'react';
import PhotoAlbum from 'react-photo-album';
import { useInitialRender } from '@/hooks/initial-render';
import { Gallery as PhotoswipeGallery, Item as PhotoswipeItem } from 'react-photoswipe-gallery';
import type { LocalImageProps } from '@/utils/image-props';
import { getActiveImage, getImageSizes, getImageSrcSet } from '@/hooks/image';
import { useBreakpoint } from '@/hooks/breakpoints';

interface ImageGalleryProps {
  images: LocalImageProps[];
  mode?: 'normal' | 'square';
}

export const Gallery: FC<ImageGalleryProps> = ({ images, mode = 'normal' }) => {
  const initialRender = useInitialRender();
  return initialRender ? (
    <InternalGallery images={images} mode={mode} />
  ) : (
    <PhotoswipeGallery
      options={{
        arrowNext: true,
        arrowPrev: true,
        zoom: false,
        counter: true,
        loop: true,
      }}
    >
      <InternalGallery images={images} mode={mode} />
    </PhotoswipeGallery>
  );
};

const useLayout = () => {
  const matcher = useBreakpoint();

  let layout: 'masonry' | 'columns' | 'rows' = 'columns';
  let spacing = 5;
  let columns = 4;
  if (matcher.matchDown('md')) {
    layout = 'columns';
    spacing = 8;
    columns = 2;
  }

  return { layout, spacing, columns };
};

export const InternalGallery: FC<ImageGalleryProps> = ({ images, mode = 'normal' }) => {
  const initialRender = useInitialRender();
  const layout = useLayout();

  return (
    <PhotoAlbum
      defaultContainerWidth={800}
      {...layout}
      photos={images.map((image) => ({
        srcSet: image.sizes(mode),
        src: image.getUrl('original', mode),
        ...image.getSize('original', mode),
        props: image,
      }))}
      renderContainer={({ containerRef, containerProps: { className, ...containerProps }, children }) => (
        <div ref={containerRef} {...containerProps} className={`${className} not-prose`}>
          {children}
        </div>
      )}
      renderPhoto={({
        imageProps: { src, alt, className, style, width, onClick, height, ...restImageProps },
        photo: { props },
      }) => {
        const sizes = getImageSizes(props, mode);
        const srcSet = getImageSrcSet(sizes);
        const activeImage = getActiveImage(sizes);

        if (initialRender) {
          return (
            <img
              src={src}
              alt={alt}
              srcSet={srcSet}
              style={style}
              className={`${className ?? ''} cursor-pointer`}
              onClick={onClick}
              {...restImageProps}
            />
          );
        }

        return (
          <PhotoswipeItem
            original={sizes.original}
            thumbnail={activeImage}
            originalSrcset={srcSet}
            {...props.getSize('original', mode)}
          >
            {({ ref, open }) => (
              <img
                src={src}
                alt={alt}
                srcSet={srcSet}
                style={style}
                className={`${className ?? ''} cursor-pointer`}
                ref={ref as any}
                onClick={(e) => {
                  open(e);
                  onClick?.(e);
                }}
                {...restImageProps}
              />
            )}
          </PhotoswipeItem>
        );
      }}
    />
  );
};
