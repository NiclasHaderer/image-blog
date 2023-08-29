import { luft, LuftInfer } from '@luftschloss/validation';

export const ImageResolution = luft
  .object({
    width: luft.int(),
    height: luft.int(),
  })
  .named('ImageResolution');
export type ImageResolution = LuftInfer<typeof ImageResolution>;

export const ImageResolutions = luft
  .object({
    xs: ImageResolution,
    s: ImageResolution,
    md: ImageResolution,
    lg: ImageResolution,
    original: ImageResolution,
  })
  .named('ImageResolutions');
export type ImageResolutions = LuftInfer<typeof ImageResolutions>;

export const ImageResolutionsWithAspectRations = luft
  .object({
    square: ImageResolutions,
    normal: ImageResolutions,
  })
  .named('ImageResolutionsWithAspectRations');
export type ImageResolutionsWithAspectRations = LuftInfer<typeof ImageResolutionsWithAspectRations>;

export const PostImageMetadata = luft
  .object({
    // The absolute path to the image
    path: luft.string(),
    name: luft.string(),
    // The date timestamp (ms) the image was modified on disk. The date the image was taken is not relevant!
    modifiedAt: luft.number(),
  })
  .named('PostImageMetadata');
export type PostImageMetadata = LuftInfer<typeof PostImageMetadata>;

export const PostImages = luft
  .record(
    luft.string().named('imageName'),
    PostImageMetadata.merge({
      resolutions: ImageResolutionsWithAspectRations,
    }),
  )
  .named('PostImages');
export type PostImages = LuftInfer<typeof PostImages>;
