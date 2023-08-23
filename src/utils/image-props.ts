import type { ImageSizes } from '../models/post-images-metadata';
import { ImageSizeNames } from '../models/post-images-metadata';

export interface LocalImageProps {
  post: string;
  imageName: string;
  getUrl(size: ImageSizeNames, mode: 'normal' | 'square'): string;
  getSize(size: ImageSizeNames, mode: 'normal' | 'square'): { width: number; height: number };
  sizes(mode: 'normal' | 'square'): { width: number; height: number; src: string }[];
}

export const getImageProps = <T extends string | string[]>(
  post: string,
  imageSizes: ImageSizes,
): ((imageName: T) => T extends any[] ? LocalImageProps[] : LocalImageProps) => {
  const get = (imageName: string): LocalImageProps => {
    if (!imageSizes[imageName]) throw new Error(`Image ${imageName} does not exist in post ${post}`);
    return {
      post,
      imageName,
      getUrl(size, mode) {
        return `/images/${post}/${imageName}/${size}${mode === 'normal' ? '' : '_square'}.webp`;
      },
      getSize(size, mode) {
        return imageSizes[imageName][mode][size];
      },
      sizes(mode) {
        return (Object.keys(imageSizes[imageName][mode]) as ImageSizeNames[]).map((size) => {
          return {
            width: imageSizes[imageName][mode][size].width,
            height: imageSizes[imageName][mode][size].height,
            src: this.getUrl(size, mode),
          };
        });
      },
    };
  };

  return (imageName) => {
    if (Array.isArray(imageName)) {
      return imageName.map((name) => get(name)) as T extends any[] ? LocalImageProps[] : LocalImageProps;
    }
    return get(imageName) as T extends any[] ? LocalImageProps[] : LocalImageProps;
  };
};
