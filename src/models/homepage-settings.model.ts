import { luft, LuftInfer } from '@luftschloss/validation';
import { CompiledImages, ImageMetadata } from '@/models/image.model';

export const HomepageSettingsMetadata = luft
  .object({
    title: luft.string(),
    headerImage: luft.string(),
    numberOfPosts: luft.number(),
    capabilities: luft.array(luft.string()),
  })
  .named('HomepageSettingsMetadata');

export type HomepageSettingsMetadata = LuftInfer<typeof HomepageSettingsMetadata>;

export const HomepageSettings = luft
  .object({
    images: luft.array(ImageMetadata),
    modifiedAt: luft.number(),
  })
  .extend(HomepageSettingsMetadata)
  .named('HomepageSettings');

export type HomepageSettings = LuftInfer<typeof HomepageSettings>;

export const CompiledHomepageSettings = HomepageSettings.omit(['images'])
  .extend(
    luft.object({
      images: CompiledImages,
    }),
  )
  .named('CompiledHomepageSettings');
export type CompiledHomepageSettings = LuftInfer<typeof CompiledHomepageSettings>;
