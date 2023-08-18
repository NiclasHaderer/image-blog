export interface ImagePath {
  post: string;
  imageName: string;
  path: string;
}

export const getImagePath = (post: string): ((imageName: string) => ImagePath) => {
  return (imageName) => {
    return {
      post,
      imageName,
      path: `/images/${post}/${imageName}`,
    };
  };
};
