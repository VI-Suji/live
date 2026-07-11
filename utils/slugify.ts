export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0D00-\u0D7F\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200);
};

export const decodeSlug = (slug: string) => {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
};

export const getNewsSharePath = (title: string) => `/news/${slugify(title)}`;

export const getStorySharePath = (slug: string) => `/story/${slug}`;

export const getAbsoluteShareUrl = (origin: string, path: string) => `${origin}${path}`;
