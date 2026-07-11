const DEFAULT_OG_IMAGE = 'https://www.gramika.in/gramika.png';
const SITE_ORIGIN = 'https://www.gramika.in';

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
    if (image.includes('cdn.sanity.io') && !image.includes('w=')) {
      const separator = image.includes('?') ? '&' : '?';
      return `${image}${separator}w=1200&h=630&fit=crop&auto=format&q=80`;
    }
    return image;
  }

  return `${SITE_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`;
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

export const getNewsCategoryLabel = (type?: string, category?: string) => {
  if (category) return category;

  const labels: Record<string, string> = {
    localNews: 'Local News',
    nationalNews: 'National News',
    entertainmentNews: 'Entertainment',
    healthNews: 'Health',
    sportsNews: 'Sports',
    topStory: 'Top Story',
  };

  return type ? labels[type] || 'News' : 'News';
};
