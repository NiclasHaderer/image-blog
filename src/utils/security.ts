import { PostPreferences } from '@/preferences';

export const removeSensitivePaths = <T extends Record<string, any>>(data: T): T => {
  // This removes user sensitive data (in this case, mainly the path to the post)
  // To achieve this iterate over the object and remove all keys where the value is a string and starts with
  // PostPreferences.PostRootDir|CompiledPostsRootDir|CompiledImagesRootDir

  const sensitivePaths = [
    PostPreferences.PostRootDir,
    PostPreferences.CompiledPostsRootDir,
    PostPreferences.CompiledImagesRootDir,
  ];

  const removeSensitivePathsRecursive = (data: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = Array.isArray(data) ? [] : {};
    for (const key in data) {
      const value = data[key];
      if (typeof value === 'string' && sensitivePaths.some((path) => value.startsWith(path))) {
        continue;
      }
      if (typeof value === 'object' && value !== null) {
        result[key] = removeSensitivePathsRecursive(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  return removeSensitivePathsRecursive(data) as T;
};
