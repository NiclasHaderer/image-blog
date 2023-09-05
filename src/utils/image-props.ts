import { CompiledImages, ImageResolutions } from '@/models/image.model';

export interface LocalImageProps {
  imageName: string;

  getUrl(size: keyof ImageResolutions, mode: 'normal' | 'square'): string;

  getSize(size: keyof ImageResolutions, mode: 'normal' | 'square'): { width: number; height: number };

  getAllSizes(mode: 'normal' | 'square'): { width: number; height: number; src: string }[];

  sizes(mode: 'normal' | 'square'): { width: number; height: number; src: string }[];
}

export const getImageProps = <T extends string | string[]>(
  imageSizes: CompiledImages,
  basePath: string,
): ((imageName: T) => T extends string[] ? LocalImageProps[] : LocalImageProps) => {
  const get = (imageName: string): LocalImageProps => {
    if (!imageSizes[imageName]) {
      console.error(`The post "${basePath}" does not have the image "${imageName}"`);
      console.error(`Allowed values are: ${Object.keys(imageSizes).join(', ')}.`);
      throw new Error();
    }
    return {
      imageName,
      getUrl(size, mode) {
        return `/generated-images/${basePath}/${imageName}/${size}${mode === 'normal' ? '' : '_square'}.webp`;
      },
      getAllSizes(mode: 'normal' | 'square'): { width: number; height: number; src: string }[] {
        return (Object.keys(imageSizes[imageName].resolutions[mode]) as (keyof ImageResolutions)[]).map((size) => {
          return {
            ...this.getSize(size, mode),
            src: this.getUrl(size, mode),
          };
        });
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
      return imageName.map((name) => get(name)) as T extends string[] ? LocalImageProps[] : LocalImageProps;
    }
    return get(imageName) as T extends string[] ? LocalImageProps[] : LocalImageProps;
  };
};
