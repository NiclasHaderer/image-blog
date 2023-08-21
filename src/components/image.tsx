import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import type { LocalImageProps } from '@/utils/image-props';
import { useHasBeenVisible } from '@/hooks/has-been-visible';

export interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  image: LocalImageProps;
  alt: string;
  mode?: 'normal' | 'square';
  fadeInDuration?: 300 | 500 | 700 | 1000;
}

interface ImageSizes {
  original: string;
  xs: string;
  s: string;
  md: string;
  l: string;
}

const fadeDurations = {
  200: 'duration-200',
  300: 'duration-300',
  500: 'duration-500',
  700: 'duration-700',
  1000: 'duration-1000',
};

/**
 * This is an image that uses a low-res placeholder (blurred) image and then
 * loads the full image when it comes into view.
 */
export const Image = forwardRef<HTMLElement, ImageProps>(
  ({ image, mode = 'normal', fadeInDuration = 500, alt, className, ...props }, ref) => {
    const sizes: ImageSizes = useImageSizes(image, mode);
    const fadeOutDuration = fadeDurations[fadeInDuration];
    const srcSet = useImageSrcSet(sizes);
    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const inViewPort = useHasBeenVisible(imageWrapperRef);

    const [loaded, setLoaded] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
      if (!loaded) return;
      const timeout = setTimeout(() => setHide(true), fadeInDuration);
      return () => clearTimeout(timeout);
    }, [fadeInDuration, loaded]);

    const visible = loaded && inViewPort;
    return (
      <div
        className={`relative ${className}`}
        ref={(instance) => {
          imageWrapperRef.current = instance;
          if (ref) {
            if (typeof ref === 'function') {
              ref(instance);
            } else {
              ref.current = instance;
            }
          }
        }}
        {...props}
      >
        {!hide && (
          <div
            className={`overflow-hidden z-10 transition-opacity ease-in absolute inset-0 opacity-100 ${fadeOutDuration} ${
              visible ? '!opacity-0' : ''
            }`}
          >
            <img
              src={sizes.xs}
              className="w-full h-full blur-xl scale-125"
              alt={`Placeholder: ${alt}`}
              loading="lazy"
            />
          </div>
        )}

        <img
          className="w-full"
          {...image.getSize('original', mode)}
          srcSet={srcSet}
          alt={alt}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          ref={(element) => {
            if (element?.complete) {
              // Delay the blur up, because for some reason the image is sometimes not loaded
              setTimeout(() => setLoaded(true), 100);
            }
          }}
        />
      </div>
    );
  },
);
Image.displayName = 'Image';

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

export const useImageSizes = (image: LocalImageProps, mode: 'normal' | 'square'): ImageSizes => {
  const [sizes, setSizes] = useState(getImageSizes(image, mode));

  useEffect(() => setSizes(getImageSizes(image, mode)), [image, mode]);
  return sizes;
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

export const useImageSrcSet = (sizes: ImageSizes): string => {
  const [srcSet, setSrcSet] = useState(getImageSrcSet(sizes));
  useEffect(() => setSrcSet(getImageSrcSet(sizes)), [sizes]);
  return srcSet;
};

export const getImageSrcSet = (sizes: ImageSizes): string => {
  return `${sizes.original} 1800w, ${sizes.l} 900w, ${sizes.md} 500w, ${sizes.s} 100w, ${sizes.xs} 1w`;
};
