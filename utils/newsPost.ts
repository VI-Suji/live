import { sanityClient } from '../sanity/config';
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

const NEWS_POST_FIELDS = `{
  _id,
  _type,
  title,
  slug,
  author,
  "mainImage": coalesce(mainImage.asset->url, image.asset->url),
  "seoImage": coalesce(mainImage.asset->url, image.asset->url) + "?w=1200&h=630&fit=crop&auto=format&q=80",
  "excerpt": coalesce(excerpt, description),
  body,
  publishedAt,
  featured,
  category
}`;

const LATEST_NEWS_FIELDS = `{
  _id,
  "title": heading,
  "excerpt": content,
  "publishedAt": date,
  "mainImage": image.asset->url,
  "seoImage": select(
    defined(image.asset->url) => image.asset->url + "?w=1200&h=630&fit=crop&auto=format&q=80",
    null
  ),
  "category": "Latest News"
}`;

export const ALL_NEWS_POSTS_QUERY = `{
  "standard": *[_type in ["topStory", "localNews", "nationalNews", "entertainmentNews", "healthNews", "sportsNews"] && (!defined(active) || active == true)] ${NEWS_POST_FIELDS},
  "latest": *[_type == "latestNews" && active == true] ${LATEST_NEWS_FIELDS}
}`;

export const TOP_STORY_POSTS_QUERY = `*[_type == "topStory" && (!defined(active) || active == true)] ${NEWS_POST_FIELDS}`;

export const matchPostByIdentifier = (post: NewsPost, identifier: string) => {
  const decoded = decodeSlug(identifier);
  return post.slug?.current === decoded || slugify(post.title) === decoded;
};

export const normalizeNewsPost = (post: NewsPost): NewsPost => {
  const mainImage = getOgImageUrl(post.mainImage);
  return {
    ...post,
    mainImage,
    seoImage: getOgImageUrl(post.seoImage || post.mainImage),
  };
};

const flattenNewsPosts = (data: { standard: NewsPost[]; latest: NewsPost[] }) => [
  ...(data.standard || []).map((post) => ({ ...post, _type: post._type || 'news' })),
  ...(data.latest || []).map((post) => ({ ...post, _type: 'latestNews' })),
];

export const findNewsPostByIdentifier = async (identifier: string) => {
  const data = await sanityClient.fetch<{ standard: NewsPost[]; latest: NewsPost[] }>(
    ALL_NEWS_POSTS_QUERY
  );
  const posts = flattenNewsPosts(data);
  const post = posts.find((item) => matchPostByIdentifier(item, identifier));
  return post ? normalizeNewsPost(post) : null;
};

export const findTopStoryByIdentifier = async (identifier: string) => {
  const posts = await sanityClient.fetch<NewsPost[]>(TOP_STORY_POSTS_QUERY);
  const post = posts.find((item) => matchPostByIdentifier(item, identifier));
  return post ? normalizeNewsPost(post) : null;
};
