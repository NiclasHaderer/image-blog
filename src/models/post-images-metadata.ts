import { luft, LuftInfer } from '@luftschloss/validation';

const Size = luft.object({ width: luft.int(), height: luft.int() });

const Sizes = luft.object({
  xs: Size,
  s: Size,
  md: Size,
  lg: Size,
  original: Size,
});

export const ImageSizes = luft.record(
  luft.string(),
  luft.object({
    square: Sizes,
    normal: Sizes,
  }),
);
export type ImageSizes = LuftInfer<typeof ImageSizes>;

export type ImageSizeNames = 'original' | 'lg' | 'md' | 's' | 'xs';

export const PostImagesMetadata = luft.object({
  imageCount: luft.int(),
  newestImageDate: luft.int(),
  imageSizes: ImageSizes,
});

export type PostImagesMetadata = LuftInfer<typeof PostImagesMetadata>;
