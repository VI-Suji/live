import { getNewsSharePath, getStorySharePath } from './slugify';

const SITE_ORIGIN = 'https://www.gramika.in';

const getOptimizedSiteImageUrl = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}/_next/image?url=${encodeURIComponent(normalized)}&w=1200&h=630&fit=cover&q=80`;
};

const DEFAULT_OG_IMAGE = getOptimizedSiteImageUrl('/gramika.png');

export const getOgImageType = (imageUrl: string) => {
  const lower = imageUrl.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
};

export const getOgImageUrl = (image?: string | null) => {
  if (!image || image === 'null' || image.startsWith('null?')) {
    return DEFAULT_OG_IMAGE;
  }

  if (image.startsWith('http')) {
    if (image.includes('gramika.in') && image.includes('/gramika.png')) {
      return DEFAULT_OG_IMAGE;
    }
    if (image.includes('cdn.sanity.io') && !image.includes('w=')) {
      const separator = image.includes('?') ? '&' : '?';
      return `${image}${separator}w=1200&h=630&fit=crop&auto=format&q=80`;
    }
    return image;
  }

  return getOptimizedSiteImageUrl(image);
};

export const getPlainTextDescription = (
  input?: string | null,
  fallback = '',
  maxLength = 200
) => {
  if (!input) return fallback;

  let text = input;

  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        text = parsed
          .map((block) =>
            Array.isArray(block.children)
              ? block.children.map((child: { text?: string }) => child.text || '').join('')
              : ''
          )
          .join(' ');
      }
    } catch {
      // Keep the original string when it is not portable text JSON.
    }
  }

  text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  if (!text) return fallback;
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 3).trim()}...`;
};

export const buildWhatsAppShareUrl = (shareUrl: string) =>
  `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;

/**
 * Canonical share URL for WhatsApp / social previews.
 * Uses readable Malayalam /news/slug (not percent-encoded) plus optional Sanity id
 * so the correct article (and image) is resolved even when titles slug-collide.
 */
export const getCanonicalNewsShareUrl = (title: string, id?: string) =>
  `${SITE_ORIGIN}${getNewsSharePath(title, id)}`;

/** Canonical production URL for /story/ feature shares. */
export const getCanonicalStoryShareUrl = (slug: string) =>
  `${SITE_ORIGIN}${getStorySharePath(slug)}`;

export const getNewsCategoryLabel = (type?: string, category?: string) => {
  if (category) return category;

  const labels: Record<string, string> = {
    localNews: 'Local News',
    nationalNews: 'National News',
    entertainmentNews: 'Entertainment',
    healthNews: 'Health',
    sportsNews: 'Sports',
    topStory: 'Top Story',
    latestNews: 'Latest News',
  };

  return type ? labels[type] || 'News' : 'News';
};

export const getSiteOrigin = () =>
  typeof window !== 'undefined' ? window.location.origin : SITE_ORIGIN;
