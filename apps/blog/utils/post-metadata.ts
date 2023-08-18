import { luft, LuftInfer } from '@luftschloss/validation';

export const PostMetadata = luft.object({
  title: luft.string(),
  date: luft.string().beforeHook((value) => {
    return {
      data: (value as any).toString(),
      action: 'continue',
    };
  }),
  description: luft.string().optional(),
  image: luft.string().optional(),
  tags: luft.array(luft.string()).optional(),
});

export type PostMetadata = LuftInfer<typeof PostMetadata>;
