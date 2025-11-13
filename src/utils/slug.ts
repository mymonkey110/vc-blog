export const toSlug = (input: string): string => {
  return (input || '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[:/\\?%*|"<>]/g, '-')
    .replace(/-+/g, '-');
};

