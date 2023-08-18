import { luft, LuftInfer } from '@luftschloss/validation';

export const PostImagesMetadata = luft.object({
  imageCount: luft.int(),
  newestImageDate: luft.int(),
});

export type PostImagesMetadata = LuftInfer<typeof PostImagesMetadata>;
