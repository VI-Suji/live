export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0D00-\u0D7F\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200);
};

export const getNewsSharePath = (title: string) => `/news/${encodeURIComponent(slugify(title))}`;
