export const areUniqueBy = <T>(arr: T[], func: (item: T) => unknown): T[] | undefined => {
  const map = new Map<unknown, T>();
  const nonUnique: T[] = [];

  for (const item of arr) {
    const key = func(item);
    if (map.has(key)) {
      nonUnique.push(item, map.get(key)!);
      continue;
    }
    map.set(key, item);
  }

  return nonUnique.length ? nonUnique : undefined;
};

export const mapUnique = <T, U>(arr: T[], func: (item: T) => U): U[] => {
  const set = new Set<U>();

  for (const item of arr) {
    set.add(func(item));
  }

  return [...set.values()];
};
