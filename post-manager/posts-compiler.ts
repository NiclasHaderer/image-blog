import { CompiledPost, Post, PostContent } from '@/models/raw-post';
import { PostConstants } from './post-constants';
import path from 'node:path';
import { ensureDir, parseFile, saveFile } from '@/utils/file';
import fs from 'node:fs';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { ImageOptimizer } from './image-optimizer';

const getExistingPost = async (outputDir: string): Promise<CompiledPost | undefined> => {
  // Check if the post already exists by reading its metadata
  const metadataPath = path.join(outputDir, PostConstants.CompiledPostMetadataFilename);
  if (!fs.existsSync(metadataPath)) return undefined;
  const metadata = await parseFile(metadataPath, CompiledPost, { safety: 'safe' });
  if (metadata.success) {
    return metadata.data;
  }
  return undefined;
};

const compilePost = async (post: Post, postDir: string) => {
  // Compile and save the post
  const postContent = await fs.promises.readFile(post.postPath, 'utf-8');
  const serializedPost = await serialize(postContent, {
    mdxOptions: {
      development: false,
      remarkPlugins: [remarkGfm, remarkEmoji],
    },
  });
  const postPath = path.join(postDir, PostConstants.CompiledPostFilename);
  await saveFile(postPath, serializedPost, PostContent);
};

const compileImage = async (image: Post['images'][number], imagesDir: string) => {
  return {
    ...image,
    resolutions: await ImageOptimizer.optimize(image.path, imagesDir),
  };
};

const _compile = async (post: Post, postDir: string, imagesDir: string) => {
  // Compile and save the post
  await compilePost(post, postDir);

  // Write the images
  const imageResolutions = await Promise.all(post.images.map((image) => compileImage(image, imagesDir)));

  // Save the post-metadata
  const metadataPath = path.join(postDir, PostConstants.CompiledPostMetadataFilename);
  const compiledPostMetadata: CompiledPost = {
    ...post,
    images: imageResolutions.reduce(
      (acc, image) => {
        acc[image.name] = image;
        return acc;
      },
      {} as CompiledPost['images'],
    ),
  };
  await saveFile(metadataPath, compiledPostMetadata, CompiledPost);
};

const updatePostIfNecessary = async (
  post: Post,
  existingPost: CompiledPost,
  postDir: string,
  imagesDir: string,
): Promise<CompiledPost> => {
  // Check if the post has been modified
  if (existingPost.modifiedAt < post.modifiedAt) {
    await _compile(post, postDir, imagesDir);
  }

  const { images, ...postWithoutImages } = post;
  return {
    ...existingPost,
    ...postWithoutImages,
  };
};

const updateImagesIfNecessary = async (post: Post, existingPost: CompiledPost, imagesDir: string) => {
  const newImageMetadata = {
    ...existingPost.images,
  };
  // Check if any of the images have been modified
  const newImages = post.images.filter((image) => {
    const existingImage = existingPost.images[image.name];
    if (!existingImage) return true;
    return existingImage.modifiedAt < image.modifiedAt;
  });
  // Compile the new images
  const newImageResolutions = await Promise.all(newImages.map((image) => compileImage(image, imagesDir)));
  // Add the new images to the existing images
  for (const newImage of newImageResolutions) {
    newImageMetadata[newImage.name] = newImage;
  }

  // Get deleted images
  const deletedImages = Object.keys(existingPost.images).filter((imageName) => {
    const existingImage = existingPost.images[imageName];
    if (!existingImage) return true;
  });
  // Remove the deleted images
  for (const deletedImage of deletedImages) {
    fs.rmSync(path.join(imagesDir, deletedImage), { recursive: true, force: true });
    delete newImageMetadata[deletedImage];
  }

  return {
    ...existingPost,
    images: newImageMetadata,
  };
};

const compile = async (post: Post, outputDir: string) => {
  // Create the folders necessary for the post
  const postDir = path.join(outputDir, post.slug);
  const imagesDir = path.join(postDir, PostConstants.PostImagesFolder);

  await ensureDir([postDir, imagesDir]);

  let existingPost = await getExistingPost(outputDir);
  if (!existingPost) return _compile(post, postDir, imagesDir);

  // Update the post if necessary
  existingPost = await updatePostIfNecessary(post, existingPost, postDir, imagesDir);

  // Update the images if necessary
  existingPost = await updateImagesIfNecessary(post, existingPost, imagesDir);

  // Save the post-metadata
  const metadataPath = path.join(postDir, PostConstants.CompiledPostMetadataFilename);
  await saveFile(metadataPath, existingPost, CompiledPost);
};

export const PostsCompiler = {
  compile,
};
