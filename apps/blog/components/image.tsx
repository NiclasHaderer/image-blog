import { FC, useRef, useState } from 'react';
import { ImagePath } from '../utils/image-path';
import { useHasBeenVisible } from '../hooks/has-been-visible';

/**
 * This is an image that uses a low-res placeholder (blurred) image and then
 * loads the full image when it comes into view.
 */
export const Image: FC<{ path: ImagePath }> = ({ path: { path } }) => {
  const sizes = {
    original: `${path}/original.webp`,
    xs: `${path}/xs.webp`,
    s: `${path}/s.webp`,
    md: `${path}/md.webp`,
    l: `${path}/lg.webp`,
  };
  const sizesSquared = {
    original: `${path}/original_square.webp`,
    xs: `${path}/xs_square.webp`,
    s: `${path}/s_square.webp`,
    md: `${path}/md_square.webp`,
    l: `${path}/lg_square.webp`,
  };

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const pictureRef = useRef<HTMLImageElement>(null);
  const inViewPort = useHasBeenVisible(imageWrapperRef);
  const [loaded, setLoaded] = useState(false);

  const visible = loaded && inViewPort;
  return (
    <div className="relative" ref={imageWrapperRef}>
      <picture
        className={`w-full transition-opacity opacity-0 duration-500 ${visible ? '!opacity-100' : ''}`}
        {/*https://stackoverflow.com/questions/39777833/image-onload-event-in-isomorphic-universal-react-register-event-after-image-is*/}
        onLoad={() => setLoaded(true)}
      >
        <source srcSet={sizes.original} media="(min-width: 1200px)" />
        <source srcSet={sizes.l} media="(min-width: 992px)" />
        <source srcSet={sizes.md} media="(min-width: 768px)" />
        <source srcSet={sizes.s} media="(min-width: 576px)" />
        <source srcSet={sizes.xs} media="(min-width: 0px)" />
        <img ref={pictureRef} className="w-full" alt="" src={sizes.xs} />
      </picture>

      <div
        className={`overflow-hidden transition-opacity absolute top-0 left-0 right-0 opacity-100 duration-500 ${
          visible ? '!opacity-0' : ''
        }`}
      >
        <img src={sizes.xs} className="w-full blur-xl scale-125" alt="" />
      </div>
    </div>
  );
};
