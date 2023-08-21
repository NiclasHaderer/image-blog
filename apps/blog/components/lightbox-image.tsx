import { Gallery, Item } from 'react-photoswipe-gallery';
import { FC } from 'react';
import { useActiveImage, useImageSizes, useImageSrcSet, Image, ImageProps } from './image';
import 'photoswipe/dist/photoswipe.css';
import { useInitialRender } from '../hooks/initial-render';

export const LightboxImage: FC<ImageProps> = (props) => {
  const sizes = useImageSizes(props.image, props.mode ?? 'normal');
  const srcSet = useImageSrcSet(sizes);
  const activeImage = useActiveImage(sizes);

  const initialRender = useInitialRender();

  return initialRender ? (
    // Only render the image if it's the initial render, because the item uses a layoutEffect
    <Image {...props} />
  ) : (
    <Gallery
      options={{
        zoom: false,
      }}
    >
      <Item
        original={sizes.original}
        thumbnail={activeImage}
        originalSrcset={srcSet}
        {...props.image.getSize('original', props.mode ?? 'normal')}
      >
        {({ ref, open }) => <Image className="cursor-pointer" {...props} onClick={open} ref={ref} />}
      </Item>
    </Gallery>
  );
};
