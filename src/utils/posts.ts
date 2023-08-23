import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { PostMetadata } from '@/models/post-metadata';
import { assertUnique } from './list';
import { isSupportedImageFile, optimizeImage } from './image';
import { newestFileTime } from './file';
import { PostImagesMetadata } from '@/models/post-images-metadata';
import { getPost } from './post';

export interface ListedPost {
  slug: string;
  fileName: string;
  data: PostMetadata;
}

export const getPostFolder = async (): Promise<string[]> => {
  // Read the posts folder from an environment variable or default to the posts folder in the root directory
  const postsDir = process.env.POSTS_DIR || 'posts';
  const folders = await fs.promises.readdir(postsDir);
  // Maks sure that the folders are really folders
  folders.forEach((folder) => {
    if (!fs.lstatSync(path.join('posts', folder)).isDirectory()) {
      throw new Error(`Post ${folder} is not a folder`);
    }
  });

  // Make sure that the folders have a post.mdx file
  folders.forEach((folder) => {
    if (!fs.existsSync(path.join('posts', folder, 'post.mdx'))) {
      throw new Error(`Post ${folder} does not have a post.mdx file`);
    }
  });
  return folders;
};

export const getAllPostsMetadata = async (): Promise<{ slug: string; fileName: string; data: PostMetadata }[]> => {
  const folders = await getPostFolder();

  // Load the posts
  const posts = await Promise.all(
    folders.map(async (folderName) => {
      const postData = await getPost(folderName);
      return {
        slug: slugify(postData.metadata.title, { lower: true }),
        fileName: folderName,
        data: postData.metadata,
      };
    }),
  );

  // Make sure that the slugs are unique
  assertUnique(posts.map((post) => post.slug));
  return posts;
};

export const getPosts = async (): Promise<ListedPost[]> => {
  const posts = await getAllPostsMetadata();

  // Make sure that the dates are valid date-strings and sort the posts by date
  const transformedPosts = posts
    .map((post) => {
      const dateMs = Date.parse(post.data.date);
      if (isNaN(dateMs)) {
        throw new Error(`Invalid date: ${post.data.date}`);
      }
      return [post, dateMs] as const;
    })
    .sort(([, d1], [, d2]) => d2 - d1)
    .map((post) => post[0]);

  // Save the images the post might contain into the public folder
  for (const post of transformedPosts) {
    // Get the images for the post
    const imageSourceFolder = path.join('posts', post.fileName, 'images');

    // If the image source folder does not exist, remove the images that belong to that post (if they exist)
    if (!fs.existsSync(imageSourceFolder)) {
      if (fs.existsSync(path.join('public', 'images', post.slug))) {
        await fs.promises.rm(path.join('public', 'images', post.slug), { recursive: true });
      }
      continue;
    }

    // Validate that only images are in the folder
    const images = await fs.promises.readdir(imageSourceFolder);
    for (const image of images) {
      const isFile = fs.lstatSync(path.join(imageSourceFolder, image)).isFile();
      if (!isFile) throw new Error(`Image ${image} is not a file`);
      if (!isSupportedImageFile(image)) throw new Error(`Image ${image} is not a supported image file`);
    }

    const newestFile = await newestFileTime(images.map((image) => path.join(imageSourceFolder, image)));

    // Read the metadata file if it exists
    let oldPostImageMetadata: PostImagesMetadata | undefined;
    if (fs.existsSync(path.join('public', 'images', post.slug, 'metadata.json'))) {
      const data = await fs.promises.readFile(path.join('public', 'images', post.slug, 'metadata.json'), 'utf8');
      const dataParsed = JSON.parse(data);
      if (PostImagesMetadata.validateSave(dataParsed).success) {
        oldPostImageMetadata = dataParsed;
      } else {
        console.warn('Could not parse image metadata file');
      }
    }

    // If the file-count is the same and the newest image has not been modified since the last time, skip the image
    // transformation
    if (oldPostImageMetadata?.imageCount === images.length && oldPostImageMetadata?.newestImageDate === newestFile) {
      continue;
    }

    // Remove the old images
    const imageFolder = path.join('public', 'images', post.slug);
    if (fs.existsSync(imageFolder)) {
      await fs.promises.rm(imageFolder, { recursive: true });
    }
    await fs.promises.mkdir(imageFolder, { recursive: true });

    // Transform the images and save them into the public folder
    const awaitable = images.map(async (image) => {
      const imageName = image.split('.')[0];
      const imageOutputPath = `${imageFolder}/${imageName}`;
      if (!fs.existsSync(imageOutputPath)) await fs.promises.mkdir(imageOutputPath, { recursive: true });
      const size = await optimizeImage(path.join(imageSourceFolder, image), imageOutputPath);
      return {
        [imageName]: size,
      };
    });

    const sizes = await Promise.all(awaitable).then((sizes) => sizes.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

    // Save a metadata file which contains the newest date one of the images has been modified at and the number of
    // images.
    // Save the metadata file into the public folder of the post.
    const postImageMetadata: PostImagesMetadata = {
      newestImageDate: newestFile,
      imageCount: images.length,
      imageSizes: sizes,
    };

    // Write the metadata file
    await fs.promises.writeFile(path.join(imageFolder, 'metadata.json'), JSON.stringify(postImageMetadata, null, 2));
  }

  return transformedPosts;
};
