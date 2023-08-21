export interface ImageProps {
  post: string;
  imageName: string;
  resolution: {
    width: number;
    height: number;
  };
  getSize(size: 'original' | 'lg' | 'md' | 's' | 'xs', mode?: 'normal' | 'square'): string;
}

export const getImageProps = (
  post: string,
  imageSizes: Record<string, { width: number; height: number }>
): ((imageName: string) => ImageProps) => {
  return (imageName) => {
    if (!imageSizes[imageName]) throw new Error(`Image ${imageName} does not exist in post ${post}`);
    return {
      post,
      imageName,
      resolution: imageSizes[imageName],
      getSize: (size, mode = 'normal') => {
        return `/images/${post}/${imageName}/${size}${mode === 'normal' ? '' : '_square'}.webp`;
      },
    };
  };
};
