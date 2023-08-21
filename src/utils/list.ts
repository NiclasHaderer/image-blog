export const assertUnique = (arr: string[]) => {
  const unique = new Set(arr).size === arr.length;
  if (!unique) {
    // get the duplicates
    const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
    throw new Error(`Duplicate items found: ${duplicates.join(', ')}`);
  }

  return true;
};
