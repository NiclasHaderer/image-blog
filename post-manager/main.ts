import { PostGroupCollector } from './post-group-collector';

import { PostGroupCompiler } from './post-group-compiler';

const collectAndCompile = async () => {
  const postGroups = await PostGroupCollector.collect();
  await Promise.all(
    postGroups.map(async (postGroup) => {
      await PostGroupCompiler.compile(postGroup);
    }),
  );
};

void collectAndCompile();
