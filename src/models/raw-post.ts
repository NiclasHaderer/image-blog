import { LuftInfer, luft } from '@luftschloss/validation';

export const ImageResolution = luft.object({
  width: luft.int(),
  height: luft.int(),
});
export type ImageResolution = LuftInfer<typeof ImageResolution>;

export const ImageResolutions = luft.object({
  xs: ImageResolution,
  s: ImageResolution,
  md: ImageResolution,
  lg: ImageResolution,
  original: ImageResolution,
});
export type ImageResolutions = LuftInfer<typeof ImageResolutions>;

export const ImageResolutionsWithAspectRations = luft.object({
  square: ImageResolutions,
  normal: ImageResolutions,
});
export type ImageResolutionsWithAspectRations = LuftInfer<typeof ImageResolutionsWithAspectRations>;

export const PostImageMetadata = luft.object({
  // The absolute path to the image
  path: luft.string(),
  name: luft.string(),
  // The date timestamp (ms) the image was modified on disk. The date the image was taken is not relevant!
  modifiedAt: luft.int(),
});
export type PostImageMetadata = LuftInfer<typeof PostImageMetadata>;

export const Post = luft.object({
  // The title of the post -> will be used as the slug
  title: luft.string(),
  slug: luft.string(),
  // The date of the post
  date: luft.string().beforeHook((value) => {
    return {
      data: (value as any).toString(),
      action: 'continue',
    };
  }),
  description: luft.string(),
  layout: luft.literal(['post']),
  tags: luft.array(luft.string()).optional(),

  headerImage: PostImageMetadata.optional(),
  images: luft.array(PostImageMetadata),
  // Information about the whereabouts of the post
  postPath: luft.string(),
  postFolder: luft.string(),

  // Used to determine when the post-file itself was modified (images are not included)
  modifiedAt: luft.int(),
});
export type Post = LuftInfer<typeof Post>;

export const CompiledPost = Post.omit(['images']).extend(
  luft.object({
    images: luft.record(
      luft.string(),
      PostImageMetadata.extend(
        luft.object({
          resolutions: ImageResolutionsWithAspectRations,
        }),
      ),
    ),
  }),
);
export type CompiledPost = LuftInfer<typeof CompiledPost>;

export const PostMetadata = Post.omit(['images']);
export type PostMetadata = LuftInfer<typeof PostMetadata>;

export const PostGroup = luft.object({
  // slug of the post (not the folder name!)
  slug: luft.string(),
  // title of the post (will be transformed to a slug)
  title: luft.string(),
  description: luft.string().optional(),
  headerImage: PostImageMetadata.optional(),
  posts: luft.array(Post),
  layout: luft.literal(['post']),
  // Information about the whereabouts of the post-group
  folderPath: luft.string(),

  // The date the post-group was modified. This does not necessarily have to be the latest date one of the posts was
  // modified. It only tracks the date the post-group was modified.
  modifiedAt: luft.int(),
});
export type PostGroup = LuftInfer<typeof PostGroup>;

export const CompiledPostGroup = PostGroup.omit(['posts']).extend(
  luft.object({
    posts: luft.record(luft.string(), PostMetadata),
  }),
);
export type CompiledPostGroup = LuftInfer<typeof CompiledPostGroup>;

export const PostGroupMetadata = PostGroup.omit(['posts']);
export type PostGroupMetadata = LuftInfer<typeof PostGroupMetadata>;
