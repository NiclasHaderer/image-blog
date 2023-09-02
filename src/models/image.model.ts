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

export const ImageMetadata = luft
  .object({
    // The absolute path to the image
    path: luft.string(),
    name: luft.string(),
    // The date timestamp (ms) the image was modified on disk. The date the image was taken is not relevant!
    modifiedAt: luft.number(),
  })
  .named('ImageMetadata');
export type ImageMetadata = LuftInfer<typeof ImageMetadata>;

export const CompiledImage = ImageMetadata.merge({
  resolutions: ImageResolutionsWithAspectRations,
  folder: luft.string(),
})
  .omit(['path'])
  .named('CompiledImage');
export type CompiledImage = LuftInfer<typeof CompiledImage>;

export const CompiledImages = luft.record(luft.string().named('imageName'), CompiledImage).named('CompiledImages');
export type CompiledImages = LuftInfer<typeof CompiledImages>;
