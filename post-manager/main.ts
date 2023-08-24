import { PostGroupCollector } from './post-group-collector';

import { PostGroupCompiler } from './post-group-compiler';
import chokidar from 'chokidar';
import { PostPreferences } from '@/preferences';

const collectAndCompile = async () => {
  const postGroups = await PostGroupCollector.collect();
  await Promise.all(
    postGroups.map(async (postGroup) => {
      await PostGroupCompiler.compile(postGroup);
    }),
  );
};

const main = () => {
  // Watch for changes in the post-group directory using chokidar
  // When a change is detected, and no new change has come up in 10 seconds, recompile the post-group
  let timeout: NodeJS.Timeout | null = null;
  chokidar.watch(PostPreferences.PostGroupDir).on('all', async () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await collectAndCompile();
    }, 10_000);
  });
};

main();
