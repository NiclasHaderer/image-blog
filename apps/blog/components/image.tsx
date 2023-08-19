import { forwardRef, HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react';
import { ImagePath } from '../utils/image-path';
import { useHasBeenVisible } from '../hooks/has-been-visible';

export interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  path: ImagePath;
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

/**
 * This is an image that uses a low-res placeholder (blurred) image and then
 * loads the full image when it comes into view.
 */
export const Image = forwardRef<HTMLElement, ImageProps>(
  ({ path, mode = 'normal', fadeInDuration = 500, ...props }, ref) => {
    const sizes: ImageSizes = {
      original: path.getSize('original', mode),
      xs: path.getSize('xs', mode),
      s: path.getSize('s', mode),
      md: path.getSize('md', mode),
      l: path.getSize('lg', mode),
    };

    const fadeDuration = {
      300: 'duration-300',
      500: 'duration-500',
      700: 'duration-700',
      1000: 'duration-1000',
    }[fadeInDuration];

    const srcSet = useImageSrcSet(sizes);

    const imageWrapperRef = useRef<HTMLDivElement | null>(null);
    const inViewPort = useHasBeenVisible(imageWrapperRef);

    const [loaded, setLoaded] = useState(false);
    const [hide, setHide] = useState(false);

    useEffect(() => {
      if (!loaded) return;
      const timeout = setTimeout(() => setHide(true), fadeInDuration);
      return () => clearTimeout(timeout);
    }, [loaded]);

    const visible = loaded && inViewPort;
    return (
      <div
        className="relative"
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
        <img
          className={`w-full transition-opacity opacity-0 ${fadeDuration} ${visible ? '!opacity-100' : ''}`}
          alt=""
          loading="lazy"
          srcSet={srcSet}
          src={sizes.xs}
          onLoad={() => setLoaded(true)}
          ref={(element) => {
            if (element?.complete) setLoaded(true);
          }}
        />

        {!hide && (
          <div
            className={`overflow-hidden transition-opacity absolute top-0 left-0 right-0 opacity-100 ${fadeDuration} ${
              visible ? '!opacity-0' : ''
            }`}
          >
            <img src={sizes.xs} className="w-full blur-xl scale-125" alt="" loading="lazy" />
          </div>
        )}
      </div>
    );
  }
);

export const useActiveImage = (sizes: ImageSizes): string => {
  const getActiveImage = useCallback(() => {
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
  }, [sizes]);

  const [activeImage, setActiveImage] = useState<string>(getActiveImage());
  useEffect(() => setActiveImage(getActiveImage()), [getActiveImage]);
  return activeImage;
};

export const useImageSizes = (path: ImagePath, mode: 'normal' | 'square' = 'normal'): ImageSizes => {
  const [sizes, setSizes] = useState<ImageSizes>({
    original: path.getSize('original', mode),
    xs: path.getSize('xs', mode),
    s: path.getSize('s', mode),
    md: path.getSize('md', mode),
    l: path.getSize('lg', mode),
  });

  useEffect(
    () =>
      setSizes({
        original: path.getSize('original', mode),
        xs: path.getSize('xs', mode),
        s: path.getSize('s', mode),
        md: path.getSize('md', mode),
        l: path.getSize('lg', mode),
      }),
    [path, mode]
  );
  return sizes;
};

export const useImageSrcSet = (sizes: ImageSizes): string => {
  const [srcSet, setSrcSet] = useState<string>(
    `${sizes.original} 1800w, ${sizes.l} 900w, ${sizes.md} 500w, ${sizes.s} 100w, ${sizes.xs} 1w`
  );
  useEffect(
    () => setSrcSet(`${sizes.original} 1800w, ${sizes.l} 900w, ${sizes.md} 500w, ${sizes.s} 100w, ${sizes.xs} 1w`),
    [sizes]
  );
  return srcSet;
};
