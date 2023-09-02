export const assertUnique = (arr: string[]) => {
  const unique = new Set(arr).size === arr.length;
  if (!unique) {
    // get the duplicates
    const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
    throw new Error(`Duplicate items found: ${duplicates.join(', ')}`);
  }

  return true;
};

export const zip = <T, U extends any[]>(arr: T[], func: (item: T) => U): [T, U[number]][] => {
  return arr.flatMap((item) => {
    const result = func(item);
    return result.map((r) => [item, r] as const);
  }) as [T, U[number]][];
};
