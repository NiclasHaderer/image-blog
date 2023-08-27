export const isUrl = (value: string | undefined): boolean => {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
