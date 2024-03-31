import { ImageOptimizer } from './image-optimizer';
import { CompiledImage, CompiledImages, ImageMetadata } from '@/models/image.model';
import fs from 'node:fs';
import { ensureDir } from '@/utils/file';
import path from 'node:path';

const compileImage = async (image: ImageMetadata, imagesDir: string): Promise<CompiledImage> => {
  const imagesPath = path.join(imagesDir, image.name);
  await ensureDir(imagesPath);
  return {
    ...image,
    folder: imagesPath,
    resolutions: await ImageOptimizer.optimize(image.path, imagesPath),
  };
};

const compile = async (
  images: ImageMetadata[],
  existingImages: CompiledImages | undefined,
  imagesDir: string,
): Promise<CompiledImages> => {
  existingImages = existingImages ?? {};

  await ensureDir(imagesDir);
  const newImages: CompiledImages = {};

  // Compile new images
  await Promise.all(
    images.map(async (newImage) => {
      // If the image exists, check if it needs to be updated
      if (existingImages![newImage.name]) {
        const existingImage = existingImages![newImage.name];
        if (existingImage.modifiedAt < newImage.modifiedAt) {
          console.log(`Resizing modified image: ${newImage.name}`);
          newImages[newImage.name] = await compileImage(newImage, imagesDir);
        } else {
          console.log(`Skipping image: ${newImage.name}`);
          newImages[newImage.name] = existingImage;
        }
      }
      // If the image does not exist, compile it
      else {
        console.log(`Resizing new image: ${newImage.name}`);
        newImages[newImage.name] = await compileImage(newImage, imagesDir);
      }
    }),
  );

  // Delete images that are no longer used
  await Promise.all(
    Object.keys(existingImages).map(async (existingImageName) => {
      if (!newImages[existingImageName]) {
        console.log(`Deleting unused image: ${existingImageName}`);
        await fs.promises.rm(existingImages![existingImageName].folder, { recursive: true, force: true });
      }
    }),
  );

  return newImages;
};

export const ImageCompiler = {
  compile,
};
