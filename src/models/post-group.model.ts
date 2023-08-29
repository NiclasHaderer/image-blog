import { luft, LuftInfer } from '@luftschloss/validation';
import { Post, PostMetadata } from '@/models/post.model';
import { CompiledImages, ImageMetadata } from '@/models/image.model';

export const PostGroup = luft
  .object({
    // slug of the post (not the folder name!)
    slug: luft.string(),
    // title of the post (will be transformed to a slug)
    title: luft.string(),
    description: luft.string().optional(),
    headerImage: luft.string().optional(),
    posts: luft.array(Post),
    layout: luft.literal(['post', 'images']),
    // Information about the whereabouts of the post-group
    folderPath: luft.string(),
    // Index of the post-group in the list of post-groups
    index: luft.number(),
    images: luft.array(ImageMetadata),
    // The date the post-group was modified. This does not necessarily have to be the latest date one of the posts was
    // modified. It only tracks the date the post-group was modified.
    modifiedAt: luft.number(),
  })
  .named('PostGroup');
export type PostGroup = LuftInfer<typeof PostGroup>;

export const CompiledPostGroup = PostGroup.omit(['posts', 'images'])
  .merge({
    posts: luft.record(luft.string(), PostMetadata),
    images: CompiledImages,
  })
  .named('CompiledPostGroup');
export type CompiledPostGroup = LuftInfer<typeof CompiledPostGroup>;

export const PostGroupMetadata = PostGroup.omit(['posts', 'images']).named('PostGroupMetadata');
export type PostGroupMetadata = LuftInfer<typeof PostGroupMetadata>;
