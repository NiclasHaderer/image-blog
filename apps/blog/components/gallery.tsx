import { FC } from 'react';
import { LocalImageProps } from '../utils/image-props';
import PhotoAlbum from 'react-photo-album';
import { useInitialRender } from '../hooks/initial-render';
import { Gallery as PhotoswipeGallery, Item as PhotoswipeItem } from 'react-photoswipe-gallery';
import { getActiveImage, getImageSizes, getImageSrcSet } from './image';

interface ImageGalleryProps {
  images: LocalImageProps[];
  layout?: 'columns' | 'rows' | 'masonry';
  mode?: 'normal' | 'square';
}

export const Gallery: FC<ImageGalleryProps> = ({ images, layout = 'masonry', mode = 'normal' }) => {
  const initialRender = useInitialRender();
  return initialRender ? (
    <InternalGallery images={images} layout={layout} mode={mode} />
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
      <InternalGallery images={images} layout={layout} mode={mode} />
    </PhotoswipeGallery>
  );
};

export const InternalGallery: FC<ImageGalleryProps> = ({ images, layout = 'masonry', mode = 'normal' }) => {
  return (
    <PhotoAlbum
      spacing={3}
      photos={images.map((image) => ({
        srcSet: image.sizes(mode),
        src: image.getUrl('original', mode),
        ...image.getSize('original', mode),
        props: image,
      }))}
      renderPhoto={({
        imageProps: { src, alt, className, style, width, onClick, height, ...restImageProps },
        photo: { props },
      }) => {
        const sizes = getImageSizes(props, mode);
        const srcSet = getImageSrcSet(sizes);
        const activeImage = getActiveImage(sizes);

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
      layout={layout}
    />
  );
};
