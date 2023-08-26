import { CompiledPost, Post, PostContent } from '@/models/raw-post';
import { PostConstants } from './post-constants';
import path from 'node:path';
import { ensureDir, parseFile, saveFile } from '@/utils/file';
import fs from 'node:fs';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { ImageOptimizer } from './image-optimizer';

const isProd = process.argv.includes('--prod');

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
      // Depending on the environment (next prod/dev), we have to enable/disable, otherwise this will result in
      // jsx not defined errors
      development: !isProd,
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
  const imageResolutions = await Promise.all(
    post.images.map(async (image) => {
      const imageDir = path.join(imagesDir, image.name);
      await ensureDir(imageDir);
      return compileImage(image, imageDir);
    }),
  );

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

const updateImagesIfNecessary = async (post: Post, existingPost: CompiledPost, imagesDir: string) => {
  const newImageMetadata = {
    ...existingPost.images,
  };
  // Check if any of the images have been modified
  const newImages = post.images.filter((image) => {
    const existingImage = existingPost.images[image.name];

    const shouldUpdate = !existingImage || existingImage.modifiedAt < image.modifiedAt;
    if (!shouldUpdate) console.log(`Skipping image: ${image.name}`);
    return shouldUpdate;
  });
  // Compile the new images
  const newImageResolutions = await Promise.all(
    newImages.map((image) => {
      console.log(`Compiling modified image: ${image.name}`);
      return compileImage(image, imagesDir);
    }),
  );
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
    console.log(`Deleting image: ${deletedImage}`);
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
  console.group(`Post: ${post.title}`);
  let existingPost = await getExistingPost(postDir);
  if (!existingPost) {
    console.log(`Compiling new post: ${post.title}`);
    return _compile(post, postDir, imagesDir);
  } else if (existingPost.modifiedAt < post.modifiedAt) {
    console.log(`Compiling modified post: ${post.title}`);
    await compilePost(post, postDir);
    const { images: _, ...newPostWithoutImages } = post;
    existingPost = {
      ...existingPost,
      ...newPostWithoutImages,
    };
  } else {
    console.log(`Skipping post: ${post.title}`);
  }

  // Update the images if necessary
  existingPost = await updateImagesIfNecessary(post, existingPost, imagesDir);

  // Save the post-metadata
  const metadataPath = path.join(postDir, PostConstants.CompiledPostMetadataFilename);
  await saveFile(metadataPath, existingPost, CompiledPost);
};

export const PostsCompiler = {
  compile,
};
