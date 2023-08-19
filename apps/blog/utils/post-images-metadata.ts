import { luft, LuftInfer } from '@luftschloss/validation';

export const PostImagesMetadata = luft.object({
  imageCount: luft.int(),
  newestImageDate: luft.int(),
  imageSizes: luft.record(luft.string(), luft.object({ width: luft.int(), height: luft.int() })),
});

export type PostImagesMetadata = LuftInfer<typeof PostImagesMetadata>;
