import sharp from 'sharp';

/**
 * There are multiple output image formats that will be created using this function using sharp.
 * All output images will be in the webp format and with no metadata.
 * @param imagePath
 * @param outputDirectory
 */
export const optimizeImage = async (
  imagePath: string,
  outputDirectory: string
): Promise<{
  width: number;
  height: number;
}> => {
  // Read the original image
  const image = sharp(imagePath);
  const imageInfo = await image.metadata();
  const width = imageInfo.width;
  const height = imageInfo.height;

  if (!width || !height) {
    throw new Error(`Image ${imagePath} does not have width or height`);
  }

  // Create original aspect ratio images
  await createImage(image, `${outputDirectory}/original.webp`, { width: null, height: null });
  await createImage(
    image,
    `${outputDirectory}/lg.webp`,
    width > height ? { width: Math.min(width, 1600), height: null } : { width: null, height: Math.min(width, 1600) }
  );
  await createImage(
    image,
    `${outputDirectory}/md.webp`,
    width > height
      ? {
          width: Math.min(width, 800),
          height: null,
        }
      : { width: null, height: Math.min(width, 800) }
  );
  await createImage(
    image,
    `${outputDirectory}/s.webp`,
    width > height
      ? {
          width: Math.min(width, 400),
          height: null,
        }
      : { width: null, height: Math.min(width, 400) }
  );
  await createImage(
    image,
    `${outputDirectory}/xs.webp`,
    width > height
      ? {
          width: Math.min(width, 50),
          height: null,
        }
      : { width: null, height: Math.min(width, 50) }
  );
  // Create square aspect ratio images
  const squareSize = Math.min(width, height);
  await createSquareImage(image, `${outputDirectory}/original_square.webp`, squareSize);
  await createSquareImage(image, `${outputDirectory}/lg_square.webp`, Math.min(1600, squareSize));
  await createSquareImage(image, `${outputDirectory}/md_square.webp`, Math.min(800, squareSize));
  await createSquareImage(image, `${outputDirectory}/s_square.webp`, Math.min(400, squareSize));
  await createSquareImage(image, `${outputDirectory}/xs_square.webp`, Math.min(50, squareSize));

  return { width, height };
};

const createSquareImage = async (image: sharp.Sharp, imageOutputPath: string, size: number) => {
  await image.clone().resize(size, size, { fit: 'cover' }).webp({ quality: 80 }).toFile(imageOutputPath);
};

const createImage = async (
  image: sharp.Sharp,
  imageOutputPath: string,
  size:
    | { width: number; height: null }
    | {
        height: number;
        width: null;
      }
    | { width: null; height: null }
) => {
  await image.clone().resize(size.width, size.height).webp({ quality: 80 }).toFile(imageOutputPath);
};

export const isSupportedImageFile = (filename: string): boolean => {
  const supportedExtensions: string[] = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif', 'tiff'];

  // Extract the file extension from the filename
  const fileExtension: string = filename.split('.').pop()!.toLowerCase();

  return supportedExtensions.includes(fileExtension);
};
