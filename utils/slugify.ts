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

export const getNewsSharePath = (title: string) => `/news/${encodeURIComponent(slugify(title))}`;

export const getStorySharePath = (slug: string) => `/story/${slug}`;

export const getAbsoluteShareUrl = (origin: string, path: string) => `${origin}${path}`;

export function isNewsModalUrl(
  pathname = typeof window !== "undefined" ? window.location.pathname : "",
  hash = typeof window !== "undefined" ? window.location.hash : ""
) {
  return pathname.startsWith("/news/") || hash.startsWith("#news/") || hash.startsWith("#news-");
}

export function navigateBackFromNewsModal() {
  if (typeof window === "undefined") return;
  if (!isNewsModalUrl()) return;

  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.history.replaceState(null, "", "/");
  }
}

function isHomePage(pathname = typeof window !== "undefined" ? window.location.pathname : "") {
  return pathname === "/" || pathname === "";
}

/** Navigate to the full article page (new UI). */
export function openNewsReport(title: string) {
  if (typeof window === "undefined") return;
  window.location.assign(getNewsSharePath(title));
}

/** Navigate to a home-page section from another page. */
export function navigateToHomeSection(sectionId: string) {
  if (typeof window === "undefined") return;

  if (sectionId === "home") {
    window.location.href = "/";
    return;
  }

  if (!isHomePage()) {
    window.location.href = `/#${sectionId}`;
  }
}
