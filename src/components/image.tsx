import { forwardRef, HTMLAttributes, useEffect, useRef, useState } from 'react';
import type { LocalImageProps } from '@/utils/image-props';
import { useHasBeenVisible } from '@/hooks/has-been-visible';
import { useImageSizes, useImageSrcSet } from '@/hooks/image';

export interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  image: LocalImageProps;
  alt: string;
  mode?: 'normal' | 'square';
  fadeInDuration?: 300 | 500 | 700 | 1000;
  sizes?: string;
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
  ({ image, mode = 'normal', fadeInDuration = 500, alt, sizes: srcsetSizes, className, ...props }, ref) => {
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
        className={`relative ${className ?? ''}`}
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
            className={`absolute inset-0 z-10 overflow-hidden opacity-100 transition-opacity ease-in ${fadeOutDuration} ${
              visible ? '!opacity-0' : ''
            }`}
          >
            <img
              src={sizes.xs}
              {...image.getSize('original', mode)}
              className="h-full w-full scale-125 blur-xl"
              alt={`Placeholder: ${alt}`}
            />
          </div>
        )}

        <img
          className="w-full"
          {...image.getSize('original', mode)}
          srcSet={srcSet}
          sizes={srcsetSizes}
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
