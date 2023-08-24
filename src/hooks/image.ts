import { useEffect, useState } from 'react';
import { LocalImageProps } from '@/utils/image-props';

export interface ImageSizes {
  original: string;
  xs: string;
  s: string;
  md: string;
  l: string;
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
