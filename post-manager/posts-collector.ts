import { Post, PostGroupMetadata, PostImageMetadata, PostMetadata } from '@/models/raw-post';
import path from 'node:path';
import { PostConstants } from './post-constants';
import fs from 'node:fs';
import { getItemsIn } from '@/utils/file';
import matter from 'gray-matter';
import slugify from 'slugify';
import { ImageOptimizer } from './image-optimizer';

const parsePostFile = async (postFile: string): Promise<PostMetadata> => {
  const fileContents = await fs.promises.readFile(path.join(postFile), 'utf8');
  const { data } = matter(fileContents);

  if (Object.keys(data).length === 0) {
    throw new Error('No metadata found in post.mdx. Make sure that the file starts with a metadata block!');
  }

  let parsedMetadata = PostMetadata.omit(['slug', 'postPath', 'modifiedAt']).coerce(data);
  return {
    ...parsedMetadata,
    slug: slugify(parsedMetadata.title, { lower: true }),
    postPath: postFile,
    modifiedAt: await fs.promises.stat(postFile).then((stats) => stats.mtimeMs),
  };
};

const collectMetadata = async (postGroup: PostGroupMetadata): Promise<PostMetadata[]> => {
  const postFolders = await getItemsIn(postGroup.folderPath, 'folder');

  let posts: PostMetadata[] = [];
  for (let postFolder of postFolders) {
    const postFile = path.join(postFolder, PostConstants.PostFilename);
    if (!fs.existsSync(postFile)) {
      console.error(
        `The post-group folder ${postGroup.folderPath} does not contain a ${PostConstants.PostFilename} file!`,
      );
      continue;
    }
    posts.push(await parsePostFile(postFile));
  }
  return posts;
};

const collectImageMetadata = async (post: PostMetadata): Promise<PostImageMetadata[]> => {
  const imagesPath = path.join(post.postFolder, PostConstants.PostImagesFolder);
  if (!fs.existsSync(imagesPath)) {
    return [];
  }

  let images = await getItemsIn(imagesPath, 'file');
  images = images.filter((image) => {
    const isSupported = ImageOptimizer.isSupportedImageFile(image);
    if (!isSupported) {
      console.error(`Image ${image} is not supported!`);
    }
    return isSupported;
  });

  return Promise.all(
    images.map(async (image) => {
      const imageName = path.parse(image).name;

      return {
        modifiedAt: await fs.promises.stat(image).then((stats) => stats.mtimeMs),
        path: image,
        name: imageName,
      };
    }),
  );
};

const collect = async (postGroup: PostGroupMetadata): Promise<Post[]> => {
  const posts = await collectMetadata(postGroup);
  return Promise.all(
    posts.map(async (post) => ({
      ...post,
      images: await collectImageMetadata(post),
    })),
  );
};

export const PostCollector = {
  collect,
};
