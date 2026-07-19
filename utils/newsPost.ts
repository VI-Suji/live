import { sanityLiveClient } from '../sanity/config';
import { slugify, decodeSlug } from './slugify';
import { getOgImageUrl } from './shareMeta';

export type NewsPost = {
  _id: string;
  _type: string;
  title: string;
  slug?: { current: string };
  author?: string;
  mainImage?: string;
  seoImage?: string;
  excerpt?: string;
  body?: any[];
  publishedAt?: string;
  featured?: boolean;
  category?: string;
};

// fm=jpg (not auto=format): crawlers without an Accept: image/webp header would
// otherwise get the original PNG, which can exceed WhatsApp's ~600 KB preview limit.
const OG_IMAGE_PARAMS = "?w=1200&h=630&fit=crop&fm=jpg&q=80";

const NEWS_POST_FIELDS = `{
  _id,
  _type,
  title,
  slug,
  author,
  "mainImage": coalesce(mainImage.asset->url, image.asset->url),
  "seoImage": select(
    defined(coalesce(mainImage.asset->url, image.asset->url)) => coalesce(mainImage.asset->url, image.asset->url) + "${OG_IMAGE_PARAMS}",
    null
  ),
  "excerpt": coalesce(excerpt, description),
  body,
  publishedAt,
  featured,
  "category": coalesce(category, select(
    _type == "localNews" => "Local News",
    _type == "nationalNews" => "National News",
    _type == "entertainmentNews" => "Entertainment",
    _type == "healthNews" => "Health",
    _type == "sportsNews" => "Sports",
    "News"
  ))
}`;

const LATEST_NEWS_FIELDS = `{
  _id,
  "title": heading,
  "excerpt": content,
  "publishedAt": date,
  "mainImage": image.asset->url,
  "seoImage": select(
    defined(image.asset->url) => image.asset->url + "${OG_IMAGE_PARAMS}",
    null
  ),
  "category": "Latest News"
}`;

export const ALL_NEWS_POSTS_QUERY = `{
  "standard": *[_type in ["localNews", "nationalNews", "entertainmentNews", "healthNews", "sportsNews"] && (!defined(active) || active == true) && !(_id in path("drafts.**"))] ${NEWS_POST_FIELDS},
  "latest": *[_type == "latestNews" && active == true && !(_id in path("drafts.**"))] ${LATEST_NEWS_FIELDS}
}`;

export const TOP_STORY_POSTS_QUERY = `*[_type == "topStory" && (!defined(active) || active == true) && !(_id in path("drafts.**"))] ${NEWS_POST_FIELDS}`;

export const matchPostByIdentifier = (post: NewsPost, identifier: string) => {
  const decoded = decodeSlug(identifier);
  return post.slug?.current === decoded || slugify(post.title) === decoded;
};

export const normalizeNewsPost = (post: NewsPost): NewsPost => {
  const rawMain = post.mainImage || null;
  const rawSeo = post.seoImage || rawMain;
  return {
    ...post,
    mainImage: rawMain ? getOgImageUrl(rawMain) : undefined,
    seoImage: rawSeo ? getOgImageUrl(rawSeo) : undefined,
  };
};

const flattenNewsPosts = (data: { standard: NewsPost[]; latest: NewsPost[] }) => [
  ...(data.standard || []).map((post) => ({ ...post, _type: post._type || 'news' })),
  ...(data.latest || []).map((post) => ({ ...post, _type: 'latestNews' })),
];

export const findNewsPostById = async (id: string) => {
  const data = await sanityLiveClient.fetch<{ standard: NewsPost[]; latest: NewsPost[] }>(
    ALL_NEWS_POSTS_QUERY
  );
  const posts = flattenNewsPosts(data);
  const post = posts.find((item) => item._id === id);
  return post ? normalizeNewsPost(post) : null;
};

export const findNewsPostByIdentifier = async (identifier: string, preferredId?: string) => {
  if (preferredId) {
    const byId = await findNewsPostById(preferredId);
    if (byId) return byId;
  }

  const data = await sanityLiveClient.fetch<{ standard: NewsPost[]; latest: NewsPost[] }>(
    ALL_NEWS_POSTS_QUERY
  );
  const posts = flattenNewsPosts(data);
  const matches = posts.filter((item) => matchPostByIdentifier(item, identifier));

  if (matches.length === 0) return null;
  if (matches.length === 1) return normalizeNewsPost(matches[0]);

  // When titles slug-collide across sections, prefer the post that has a share image.
  const sorted = [...matches].sort((a, b) => {
    const aHasImage = a.mainImage || a.seoImage ? 1 : 0;
    const bHasImage = b.mainImage || b.seoImage ? 1 : 0;
    if (bHasImage !== aHasImage) return bHasImage - aHasImage;
    return (
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  });

  return normalizeNewsPost(sorted[0]);
};

export const findTopStoryByIdentifier = async (identifier: string) => {
  const posts = await sanityLiveClient.fetch<NewsPost[]>(TOP_STORY_POSTS_QUERY);
  const post = posts.find((item) => matchPostByIdentifier(item, identifier));
  return post ? normalizeNewsPost(post) : null;
};
