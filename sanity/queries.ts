// Common GROQ queries for Sanity CMS
// Use these in your API routes or components

/**
 * Get all published top stories, ordered by publish date
 */
export const GET_TOP_STORIES = `*[_type == "topStory"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  author,
  "mainImage": mainImage.asset->url,
  excerpt,
  body,
  publishedAt,
  featured,
  category
}`;

/**
 * Get a single story by slug
 */
export const GET_STORY_BY_SLUG = `*[_type == "topStory" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  author,
  "mainImage": mainImage.asset->url,
  excerpt,
  body,
  publishedAt,
  featured,
  category
}`;

/**
 * Get featured top stories only
 */
export const GET_FEATURED_STORIES = `*[_type == "topStory" && featured == true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  "mainImage": mainImage.asset->url,
  excerpt,
  publishedAt
}`;

/**
 * Get local news, ordered by custom order then date
 */
export const GET_LOCAL_NEWS = `*[_type == "localNews"] | order(order asc, publishedAt desc) {
  _id,
  title,
  "image": image.asset->url,
  description,
  publishedAt,
  order
}`;

/**
 * Get the active latest news widget
 */
export const GET_LATEST_NEWS = `*[_type == "latestNews" && active == true] | order(_createdAt desc)[0] {
  _id,
  heading,
  content,
  date,
  active
}`;

/**
 * Get hero section content
 */
export const GET_HERO_CONTENT = `*[_type == "heroSection"][0] {
  _id,
  greeting,
  welcomeMessage,
  tagline,
  description,
  ctaButtonText,
  secondaryButtonText
}`;

/**
 * Get active doctors, ordered by display order
 */
export const GET_DOCTORS = `*[_type == "doctor" && active == true] | order(order asc) {
  _id,
  name,
  specialization,
  "photo": photo.asset->url,
  hospital,
  phone,
  availability,
  order
}`;

/**
 * Get active obituaries, ordered by date of death (most recent first)
 */
export const GET_OBITUARIES = `*[_type == "obituary" && active == true] | order(dateOfDeath desc) {
  _id,
  name,
  "photo": photo.asset->url,
  age,
  place,
  dateOfDeath,
  funeralDetails
}`;

/**
 * Get advertisement by position with date filtering
 * Use with parameters: { position: string, today: string }
 */
export const GET_ADVERTISEMENT = `*[_type == "advertisement" && position == $position && active == true && 
  (!defined(startDate) || startDate <= $today) && 
  (!defined(endDate) || endDate >= $today)][0] {
  _id,
  title,
  position,
  "image": image.asset->url,
  link
}`;

/**
 * Get stories by category
 */
export const GET_STORIES_BY_CATEGORY = `*[_type == "topStory" && category == $category] | order(publishedAt desc) {
  _id,
  title,
  slug,
  "mainImage": mainImage.asset->url,
  excerpt,
  publishedAt,
  author
}`;

/**
 * Search stories by title or excerpt
 */
export const SEARCH_STORIES = `*[_type == "topStory" && (
  title match $searchTerm || 
  excerpt match $searchTerm
)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  "mainImage": mainImage.asset->url,
  excerpt,
  publishedAt
}`;

/**
 * Get recent stories (last N days)
 * Use with parameter: { cutoffDate: string }
 */
export const GET_RECENT_STORIES = `*[_type == "topStory" && publishedAt > $cutoffDate] | order(publishedAt desc) {
  _id,
  title,
  slug,
  "mainImage": mainImage.asset->url,
  excerpt,
  publishedAt
}`;
