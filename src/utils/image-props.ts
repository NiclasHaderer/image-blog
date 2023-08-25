import type { CompiledPost, ImageResolutions } from '@/models/raw-post';

export interface LocalImageProps {
  post: string;
  imageName: string;

  getUrl(size: keyof ImageResolutions, mode: 'normal' | 'square'): string;

  getSize(size: keyof ImageResolutions, mode: 'normal' | 'square'): { width: number; height: number };

  sizes(mode: 'normal' | 'square'): { width: number; height: number; src: string }[];
}

export const getImageProps = <T extends string | string[]>(
  post: string,
  imageSizes: CompiledPost['images'],
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
        return imageSizes[imageName].resolutions[mode][size];
      },
      sizes(mode) {
        return (Object.keys(imageSizes[imageName].resolutions[mode]) as (keyof ImageResolutions)[]).map((size) => {
          return {
            ...this.getSize(size, mode),
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
