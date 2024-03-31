import { InferObjectType, luft, LuftArray, LuftInfer, LuftLazy, LuftNumber, LuftString } from '@luftschloss/validation';
import { CompiledImages, ImageMetadata } from '@/models/image.model';

// TODO feature flags
export const PostFileMetadata = luft
  .object({
    // The title of the post -> will be used as the slug
    title: luft.string(),
    // The date of the post
    date: luft.string().beforeHook((value) => {
      return {
        data: (value as any)?.toString(),
        action: 'continue',
      };
    }),
    description: luft.string(),
    // The header image of the post (if multiple images are provided, a carousel will be created)
    // TODO make this a union of string and array of strings
    // headerImage: luft.union([luft.string(), luft.array(luft.string())]),
    headerImage: luft.string(),

    // The color of the header image (will replace the header image if set)
    headerColor: luft.regex(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/).optional(),

    // Should the title of the post be capitalized in the post-preview list?
    capitalizeTitle: luft.bool().default(true),

    // The layout of the post
    postLayout: luft.literal(['post']).default('post'),

    // The layout that the children of this post should have
    childPostLayout: luft.literal(['blog']).default('blog'),

    // Where should the children be placed in the parent post
    childPostPosition: luft.literal(['top', 'bottom']).default('bottom'),

    // TODO Whether the post should be featured in the parent collection
    featureInParentCollection: luft.bool().default(true),

    // Keywords for the post (will be added at the top of the post)
    topKeywords: luft.array(luft.string()).default([]),

    // The size of the header (image)
    headerSize: luft.literal(['small', 'medium', 'large']).default('medium'),

    // A sub-heading for the post
    subheader: luft.string().optional(),
  })
  .named('PostFileMetadata');
export type PostFileMetadata = LuftInfer<typeof PostFileMetadata>;

type _PostMetadataModel = {
  slug: LuftString;
  postPath: LuftString;
  postDirectory: LuftString;
  images: LuftArray<typeof ImageMetadata>;
  childPosts: LuftLazy<(InferObjectType<_PostMetadataModel> & PostFileMetadata)[]>;
  modifiedAt: LuftNumber;
};

const _PostMetadata: _PostMetadataModel = {
  // The slug of the post (title will be used to generate the slug)
  slug: luft.string(),
  // Information about the whereabouts of the post
  postPath: luft.string(),
  // The folder in which the post is located
  postDirectory: luft.string(),
  // The images that are used in the post
  images: luft.array(ImageMetadata),
  // The children of the post
  childPosts: luft.lazy(() => luft.array(PostMetadata)),
  // Used to determine when the post-file itself was modified (images are not included)
  modifiedAt: luft.number(),
};

// The serialized content by next-mdx-remote
export const PostContent = luft
  .object({
    compiledSource: luft.string(),
    scope: luft.record(luft.string(), luft.any()),
    frontmatter: luft.record(luft.string(), luft.any()),
  })
  .named('PostContent');
export type PostContent = LuftInfer<typeof PostContent>;

export const PostMetadata = PostFileMetadata.merge(_PostMetadata as _PostMetadataModel).named('PostMetadata');
export type PostMetadata = LuftInfer<typeof PostMetadata>;

// A compiled post is not different from a post, except that it has the image resolutions
// and the compiled content
export const CompiledPost = PostMetadata.omit(['images'])
  .merge({
    images: CompiledImages,
    content: PostContent,
  })
  .named('CompiledPost');
export type CompiledPost = LuftInfer<typeof CompiledPost>;

export const CompiledChildPost = CompiledPost.omit(['childPosts']).named('CompiledChildPost');
export type CompiledChildPost = LuftInfer<typeof CompiledChildPost>;

export const DetailedCompiledPost = CompiledPost.omit(['childPosts'])
  .merge({
    childPosts: luft.array(CompiledChildPost),
  })
  .named('DetailedCompiledPost');
export type DetailedCompiledPost = LuftInfer<typeof DetailedCompiledPost>;
