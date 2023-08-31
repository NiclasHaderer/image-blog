import { Post, PostMetadata } from '@/models/post.model';
import path from 'node:path';
import { PostConstants } from './post-constants';
import fs from 'node:fs';
import { getItemsIn } from '@/utils/file';
import matter from 'gray-matter';
import slugify from 'slugify';
import { ImageOptimizer } from './image-optimizer';
import { parseWith } from '@/utils/validation';
import { PostGroupMetadata } from '@/models/post-group.model';

const parsePostFile = async (postFile: string): Promise<Omit<PostMetadata, 'postFolder'>> => {
  const fileContents = await fs.promises.readFile(path.join(postFile), 'utf8');
  const { data } = matter(fileContents);

  if (Object.keys(data).length === 0) {
    throw new Error('No metadata found in post.mdx. Make sure that the file starts with a metadata block!');
  }

  const parsedMetadata = parseWith(data, PostMetadata.omit(['slug', 'postPath', 'modifiedAt', 'postFolder']), {
    file: postFile,
  });
  return {
    ...parsedMetadata,
    slug: slugify(parsedMetadata.title, { lower: true }),
    postPath: postFile,
    modifiedAt: await fs.promises.stat(postFile).then((stats) => stats.mtimeMs),
  };
};

const collectMetadata = async (postGroup: PostGroupMetadata): Promise<PostMetadata[]> => {
  const postFolders = await getItemsIn(postGroup.folderPath, 'folder');

  const posts: PostMetadata[] = [];
  for (const postFolder of postFolders) {
    const postFile = path.join(postFolder, PostConstants.PostFilename);
    if (!fs.existsSync(postFile)) {
      console.error(`The post folder ${postGroup.folderPath} does not contain a ${PostConstants.PostFilename} file!`);
      continue;
    }
    posts.push({
      ...(await parsePostFile(postFile)),
      postFolder,
    });
  }
  return posts;
};

const collect = async (postGroup: PostGroupMetadata): Promise<Post[]> => {
  const posts = await collectMetadata(postGroup);
  return Promise.all(
    posts.map(async (post) => {
      const imagesPath = path.join(post.postFolder, PostConstants.ImagesFolder);
      return {
        ...post,
        images: await ImageOptimizer.getImagesMetadata(imagesPath),
      };
    }),
  );
};

export const PostCollector = {
  collect,
};
