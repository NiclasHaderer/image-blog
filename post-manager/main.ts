// TODO hash images to avoid caching issues (perhaps not needed, as the new images should have a new name)
import { PostCollector } from './posts-collector';
import { PostPreferences } from '@/preferences';
import { PostCompiler } from './post-compiler';

const collectAndCompile = async () => {
  const rootPost = await PostCollector.collect(PostPreferences.PostRootDir);
  await PostCompiler.compile(rootPost, PostPreferences.CompiledPostsRootDir, PostPreferences.CompiledImagesRootDir);
};

void collectAndCompile();
