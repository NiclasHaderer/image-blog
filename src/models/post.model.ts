import { luft, LuftInfer } from '@luftschloss/validation';
import { CompiledImages, ImageMetadata } from '@/models/image.model';

export const Post = luft
  .object({
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
    featureOnHomepage: luft.bool(),
    description: luft.string(),
    layout: luft.literal(['post']),
    tags: luft.array(luft.string()).optional(),

    headerImage: luft.string().optional(),
    headerColor: luft.regex(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/).optional(),
    images: luft.array(ImageMetadata),
    // Information about the whereabouts of the post
    postPath: luft.string(),
    postFolder: luft.string(),

    // Used to determine when the post-file itself was modified (images are not included)
    modifiedAt: luft.number(),
  })
  .named('Post');
export type Post = LuftInfer<typeof Post>;

export const CompiledPost = Post.omit(['images'])
  .merge({
    images: CompiledImages,
  })
  .named('CompiledPost');
export type CompiledPost = LuftInfer<typeof CompiledPost>;

export const PostMetadata = Post.omit(['images']).named('PostMetadata');
export type PostMetadata = LuftInfer<typeof PostMetadata>;

export const PostContent = luft
  .object({
    compiledSource: luft.string(),
    scope: luft.record(luft.string(), luft.any()),
    frontmatter: luft.record(luft.string(), luft.any()),
  })
  .named('PostContent');
export type PostContent = LuftInfer<typeof PostContent>;
