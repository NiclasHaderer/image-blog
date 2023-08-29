import { PostGroupCollector } from "./post-group-collector";
import { PostGroupCompiler } from "./post-group-compiler";
import { HomePageCollector } from "./homepage-collector";
import { HomePageCompiler } from "./homepage-compiler";

// TODO hash images to avoid caching issues (perhaps not needed, as the new images should have a new name)
const collectAndCompile = async () => {
  const homepageSettings = await HomePageCollector.collect();
  const postGroups = await PostGroupCollector.collect();
  await HomePageCompiler.compile(homepageSettings);
  await Promise.all(
    postGroups.map(async (postGroup) => {
      await PostGroupCompiler.compile(postGroup);
      // TODO remove posts-groups that are not referenced
    }),
  );
};

void collectAndCompile();
