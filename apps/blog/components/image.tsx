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
  ({ path, mode = 'normal', fadeInDuration = 500, ...props }, ref) => {
    const sizes: ImageSizes = {
      original: path.getSize('original', mode),
      xs: path.getSize('xs', mode),
      s: path.getSize('s', mode),
      md: path.getSize('md', mode),
      l: path.getSize('lg', mode),
    };

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
        {!hide && (
          <div
            className={`overflow-hidden z-10 transition-opacity absolute inset-0 opacity-100 ${fadeOutDuration} ${
              visible ? '!opacity-0' : ''
            }`}
          >
            <img src={sizes.xs} className="w-full h-full blur-xl scale-125" alt="" loading="lazy" />
          </div>
        )}

        <img
          className={`w-full`}
          alt=""
          width={path.resolution.width}
          height={path.resolution.height}
          srcSet={srcSet}
          onLoad={() => setLoaded(true)}
          ref={(element) => {
            if (element?.complete) setLoaded(true);
          }}
        />
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
