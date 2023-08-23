import sharp from 'sharp';
import { ImageSizes } from '@/models/post-images-metadata';

const calculateSize = (imageSize: { width: number; height: number }, maxDimension: number) => {
  const ratio = Math.min(maxDimension / imageSize.width, maxDimension / imageSize.height, 1);
  return { width: Math.round(imageSize.width * ratio), height: Math.round(imageSize.height * ratio) };
};

/**
 * There are multiple output image formats that will be created using this function using sharp.
 * All output images will be in the webp format and with no metadata.
 * @param imagePath
 * @param outputDirectory
 */
export const optimizeImage = async (imagePath: string, outputDirectory: string): Promise<ImageSizes['string']> => {
  // Read the original image
  const image = sharp(imagePath);
  const imageInfo = await image.metadata();
  const width = imageInfo.width;
  const height = imageInfo.height;

  if (!width || !height) throw new Error(`Image ${imagePath} does not have width or height`);
  const size = { width, height };

  // Create original aspect ratio images
  await createImage(image, `${outputDirectory}/original.webp`, size);
  await createImage(image, `${outputDirectory}/lg.webp`, calculateSize(size, 1600));
  await createImage(image, `${outputDirectory}/md.webp`, calculateSize(size, 800));
  await createImage(image, `${outputDirectory}/s.webp`, calculateSize(size, 400));
  await createImage(image, `${outputDirectory}/xs.webp`, calculateSize(size, 50));
  // Create square aspect ratio images
  const squareSize = Math.min(width, height);
  await createSquareImage(image, `${outputDirectory}/original_square.webp`, squareSize);
  await createSquareImage(image, `${outputDirectory}/lg_square.webp`, Math.min(1600, squareSize));
  await createSquareImage(image, `${outputDirectory}/md_square.webp`, Math.min(800, squareSize));
  await createSquareImage(image, `${outputDirectory}/s_square.webp`, Math.min(400, squareSize));
  await createSquareImage(image, `${outputDirectory}/xs_square.webp`, Math.min(50, squareSize));

  return {
    normal: {
      original: { width, height },
      lg: calculateSize(size, 1600),
      md: calculateSize(size, 800),
      s: calculateSize(size, 400),
      xs: calculateSize(size, 50),
    },
    square: {
      original: { width: squareSize, height: squareSize },
      lg: { width: Math.min(1600, squareSize), height: Math.min(1600, squareSize) },
      md: { width: Math.min(800, squareSize), height: Math.min(800, squareSize) },
      s: { width: Math.min(400, squareSize), height: Math.min(400, squareSize) },
      xs: { width: Math.min(50, squareSize), height: Math.min(50, squareSize) },
    },
  };
};

const createSquareImage = async (image: sharp.Sharp, imageOutputPath: string, size: number) => {
  await image.clone().resize(size, size, { fit: 'cover' }).webp({ quality: 80 }).toFile(imageOutputPath);
};

const createImage = async (
  image: sharp.Sharp,
  imageOutputPath: string,
  size: { width: number; height: number },
): Promise<{ width: number; height: number }> => {
  const newImg = image.clone().resize(size.width, size.height).webp({ quality: 80 });
  await newImg.toFile(imageOutputPath);
  const metadata = await newImg.metadata();
  return { width: metadata.width!, height: metadata.height! };
};

export const isSupportedImageFile = (filename: string): boolean => {
  const supportedExtensions: string[] = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif', 'tiff'];

  // Extract the file extension from the filename
  const fileExtension: string = filename.split('.').pop()!.toLowerCase();

  return supportedExtensions.includes(fileExtension);
};
