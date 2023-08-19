import { Gallery, Item } from 'react-photoswipe-gallery';
import { FC } from 'react';
import { useActiveImage, useImageSizes, useImageSrcSet, Image, ImageProps } from './image';
import 'photoswipe/dist/photoswipe.css';
import { useInitialRender } from '../hooks/initial-render';

export const LightboxImage: FC<ImageProps> = (props) => {
  const sizes = useImageSizes(props.path, props.mode);
  const srcSet = useImageSrcSet(sizes);
  const activeImage = useActiveImage(sizes);

  const initialRender = useInitialRender();

  return initialRender ? (
    // Only render the image if it's the initial render, because the item uses a layoutEffect
    <Image {...props} />
  ) : (
    <Gallery>
      <Item
        original={sizes.original}
        width={props.path.resolution.width}
        height={props.path.resolution.height}
        thumbnail={activeImage}
        originalSrcset={srcSet}
      >
        {({ ref, open }) => <Image {...props} onClick={open} ref={ref} />}
      </Item>
    </Gallery>
  );
};
