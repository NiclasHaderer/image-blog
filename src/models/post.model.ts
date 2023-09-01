import { luft, LuftInfer } from '@luftschloss/validation';
import { CompiledImages, ImageMetadata } from '@/models/image.model';

export const PostFileMetadata = luft
  .object({
    // The title of the post -> will be used as the slug
    title: luft.string(),
    // The date of the post
    date: luft.string().beforeHook((value) => {
      return {
        data: (value as any).toString(),
        action: 'continue',
      };
    }),
    featureOnCollection: luft.bool(),
    description: luft.string(),
    layout: luft.literal(['post']),
    headerImage: luft.union([luft.string(), luft.array(luft.string())]),
    headerColor: luft.regex(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/).optional(),
  })
  .named('PostFileMetadata');
export type PostFileMetadataModel = LuftInfer<typeof PostFileMetadata>;

// TODO fix this
export const PostMetadata: any = PostFileMetadata.merge({
  // Information about the whereabouts of the post
  postPath: luft.string(),
  postFolder: luft.string(),
  images: luft.array(ImageMetadata),
  children: luft.lazy(() => luft.array(PostMetadata)),
  // Used to determine when the post-file itself was modified (images are not included)
  modifiedAt: luft.number(),
}).named('PostMetadata');
export type PostMetadata = LuftInfer<typeof PostMetadata>;

export const CompiledPost = PostMetadata.omit(['images'])
  .merge({
    images: CompiledImages,
  })
  .named('CompiledPost');
export type CompiledPost = LuftInfer<typeof CompiledPost>;

export const PostContent = luft
  .object({
    compiledSource: luft.string(),
    scope: luft.record(luft.string(), luft.any()),
    frontmatter: luft.record(luft.string(), luft.any()),
  })
  .named('PostContent');
export type PostContent = LuftInfer<typeof PostContent>;
