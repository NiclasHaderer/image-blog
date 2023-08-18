// List all file system items in the posts directory
const fs = require('fs');
const path = require('path');
const postsDirectory = path.join(__dirname, 'posts');
const nextPostsDirectory = path.join(__dirname, 'pages/posts');
const nextPostsImagesDirectory = path.join(__dirname, 'public/images/posts');

// Ensure that the posts and the nextPostsDirectory directories exist
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory);
}
if (!fs.existsSync(nextPostsDirectory)) {
  fs.mkdirSync(nextPostsDirectory);
}
if (!fs.existsSync(nextPostsImagesDirectory)) {
  fs.mkdirSync(nextPostsImagesDirectory, { recursive: true });
}

const postFolders = fs.readdirSync(postsDirectory);
// Check if the file system item is a file or a directory
const isDirectory = (source) => fs.lstatSync(source).isDirectory();
for (const folder of postFolders) {
  if (!isDirectory(path.join(postsDirectory, folder)))
    throw new Error(`Only directories are allowed, but ${postFolders} is not a directory`);

  // Check if there is a post.mdx file in the folder
  const postFile = path.join(postsDirectory, folder, 'post.mdx');
  if (!fs.existsSync(postFile)) {
    throw new Error(`The ${folder} folder does not contain a post.mdx file`);
  }
}

// Delete all files in the pages/posts directory
for (const file of fs.readdirSync(nextPostsDirectory)) {
  fs.rmSync(path.join(nextPostsDirectory, file), { recursive: true });
}
for (const file of fs.readdirSync(nextPostsImagesDirectory)) {
  fs.rmSync(path.join(nextPostsImagesDirectory, file), { recursive: true });
}

// Copy all files from the posts directory to the pages/posts directory
for (const folder of postFolders) {
  // Copy the post.mdx file
  const postFile = path.join(postsDirectory, folder, 'post.mdx');
  const nextPostFile = path.join(nextPostsDirectory, folder + '.mdx');
  fs.copyFileSync(postFile, nextPostFile);

  // Copy the images directory
  const imagesDirectory = path.join(postsDirectory, folder, 'images');
  // If the images directory does not exist, skip it
  if (!fs.existsSync(imagesDirectory)) continue;
  const nextImagesDirectory = path.join(nextPostsImagesDirectory, folder);
  fs.cpSync(imagesDirectory, nextImagesDirectory, { recursive: true });
}
