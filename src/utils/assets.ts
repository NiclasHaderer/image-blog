import fs from "node:fs";
import path from "node:path";
import { ensureDir } from "@/utils/file";
import { getHomepage, getPost, getPostGroups } from "@/utils/post";

// TODO copy homepage images
// TODO copy post-group images

export const copyImages = async () => {
  await executeImageOperation(async (imagesPath, destination) => {
    await fs.promises.cp(imagesPath, destination);
  });
};

export const symlinkImages = async () => {
  await executeImageOperation(async (imagesPath, destination) => {
    await fs.promises.symlink(imagesPath, destination);
  });
};

const executeImageOperation = async (operation: (imagesPath: string, destination: string) => Promise<void>) => {
  const postGroups = await getPostGroups();
  const homePage = await getHomepage();

  // Copy homepage
  const homepageDestination = path.resolve(`public/gen-images/homepage`);
  if (fs.existsSync(homepageDestination)) {
    await fs.promises.rm(homepageDestination, { recursive: true, force: true });
  }
  await ensureDir(homepageDestination);
  const imagesToCopy = Object.values(homePage.images).map((image) => [
    image.folder,
    `${homepageDestination}/${image.name}`,
  ]);

  // Copy post-groups and afterward copy posts
  const groupPromises = postGroups.map(async (group) => {
    const groupDestination = path.resolve(`public/gen-images/${group.slug}`);
    if (fs.existsSync(groupDestination)) {
      await fs.promises.rm(groupDestination, { recursive: true, force: true });
    }

    await ensureDir(groupDestination);
    imagesToCopy.push(
      ...Object.values(group.images).map((image) => [image.folder, `${groupDestination}/${image.name}`]),
    );

    // Copy posts
    const postsPromises = Object.values(group.posts).map(async (groupPost) => {
      const post = await getPost(group.slug, groupPost.slug);

      // We know that that path cannot exist, because we delete the whole group folder, therefore we don't need to check
      const postDestination = path.resolve(`public/gen-images/${group.slug}/${post.slug}/`);
      await ensureDir(postDestination);
      imagesToCopy.push(
        ...Object.values(post.images).map((image) => [image.folder, `${postDestination}/${image.name}`]),
      );
    });
    await Promise.all(postsPromises);
  });

  await Promise.all(groupPromises);
  // Copy images
  const copyPromises = imagesToCopy.map(async ([imagesPath, destination]) => {
    await operation(imagesPath, destination);
  });
  await Promise.all(copyPromises);
};
