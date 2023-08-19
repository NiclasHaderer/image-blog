export interface ImagePath {
  post: string;
  imageName: string;
  resolution: {
    width: number;
    height: number;
  };
  getSize(size: 'original' | 'lg' | 'md' | 's' | 'xs', mode?: 'normal' | 'square'): string;
}

export const getImagePath = (
  post: string,
  imageSizes: Record<string, { width: number; height: number }>
): ((imageName: string) => ImagePath) => {
  return (imageName) => {
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
