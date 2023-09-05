import { Ref, useEffect, useRef, useState } from 'react';
import { LocalImageProps } from '@/utils/image-props';
import { useGlobalEvent } from '@/hooks/global-events';

export interface ImageSizes<T = string> {
  original: T;
  xs: T;
  s: T;
  md: T;
  l: T;
}

export const getActiveImage = (sizes: ImageSizes) => {
  if (typeof window === 'undefined') return sizes.md;

  const screenWidth = window.innerWidth;
  let activeImage = sizes.xs; // Default to the smallest image

  if (screenWidth >= 1800) {
    activeImage = sizes.original;
  } else if (screenWidth >= 900) {
    activeImage = sizes.l;
  } else if (screenWidth >= 500) {
    activeImage = sizes.md;
  } else if (screenWidth >= 100) {
    activeImage = sizes.s;
  }
  return activeImage;
};
export const useActiveImage = (sizes: ImageSizes): string => {
  const [activeImage, setActiveImage] = useState<string>(getActiveImage(sizes));
  useEffect(() => setActiveImage(() => getActiveImage(sizes)), [sizes]);
  return activeImage;
};
export const getImageSizes = (image: LocalImageProps, mode: 'normal' | 'square'): ImageSizes => {
  return {
    original: image.getUrl('original', mode),
    xs: image.getUrl('xs', mode),
    s: image.getUrl('s', mode),
    md: image.getUrl('md', mode),
    l: image.getUrl('lg', mode),
  };
};
export const useImageSizes = (image: LocalImageProps, mode: 'normal' | 'square'): ImageSizes => {
  const [sizes, setSizes] = useState(getImageSizes(image, mode));

  useEffect(() => setSizes(getImageSizes(image, mode)), [image, mode]);
  return sizes;
};
export const getImageSrcSet = (sizes: ImageSizes): string => {
  return `${sizes.original} 1800w, ${sizes.l} 900w, ${sizes.md} 500w, ${sizes.s} 100w, ${sizes.xs} 1w`;
};
export const useImageSrcSet = (sizes: ImageSizes): string => {
  const [srcSet, setSrcSet] = useState(getImageSrcSet(sizes));
  useEffect(() => setSrcSet(getImageSrcSet(sizes)), [sizes]);
  return srcSet;
};

export const useImageSizesAttr = (image: LocalImageProps, mode: 'normal' | 'square'): Ref<HTMLImageElement | null> => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const sizes = image.getAllSizes(mode);
  const calculateSizesProperty = (img: HTMLImageElement) => {
    return sizes
      .map((size) => {
        // Get the percentage that the image takes up of the screen at the given size
        const imageWidthPercentage = img.getBoundingClientRect().width / window.innerWidth;

        // Now the max-width for the image the width
        // where the image rect would be larger than the source size of the image
        const maxWidth = size.width / imageWidthPercentage;
        return `${maxWidth}px ${size.src}`;
      })
      .join(', ');
  };

  useGlobalEvent('resize', () => {
    if (!imageRef.current) return;
    imageRef.current.sizes = calculateSizesProperty(imageRef.current);
  });

  return (instance) => {
    if (!instance) return;
    imageRef.current = instance;
    instance.sizes = calculateSizesProperty(instance);
  };
};
