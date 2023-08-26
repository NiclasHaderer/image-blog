import { CompiledPostGroup } from '@/models/raw-post';
import { GetStaticPaths } from 'next';
import { getItemsIn, parseFile } from '@/utils/file';
import { PostPreferences } from '@/preferences';
import { PostConstants } from '../../../post-manager/post-constants';

export default function PostGroupPage({ postGroup }: Awaited<ReturnType<typeof getStaticProps>>['props']) {
  return <code>{JSON.stringify(postGroup)}</code>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: await getItemsIn(PostPreferences.CompiledPostsDir, 'folder'),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: { params: { postGroupSlug: string } }) => {
  return {
    props: {
      postGroup: await parseFile(
        `${PostPreferences.CompiledPostsDir}/${params.postGroupSlug}/${PostConstants.CompiledPostGroupMetadataFilename}`,
        CompiledPostGroup,
        { mode: 'validate' },
      ),
    },
  };
};
