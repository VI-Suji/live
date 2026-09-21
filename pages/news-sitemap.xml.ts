import { GetServerSideProps } from 'next';
import { sanityClient } from '../sanity/config';
import { slugify } from '../utils/slugify';

const EXTERNAL_DATA_URL = 'https://www.gramika.in';

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatNewsDate(dateStr?: string) {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function generateGoogleNewsSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${posts
  .map(({ _type, slug, title, publishedAt }) => {
    if (!title) return '';
    const path = _type === 'topStory' ? 'story' : 'news';
    const finalSlug = (slug && slug.current) || slugify(title || '');
    if (!finalSlug) return '';

    const cleanTitle = escapeXml(title.trim());
    const loc = `${EXTERNAL_DATA_URL}/${path}/${finalSlug}`;
    const pubDate = formatNewsDate(publishedAt);

    return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Gramika News</news:name>
        <news:language>ml</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${cleanTitle}</news:title>
    </news:news>
  </url>`;
  })
  .filter(Boolean)
  .join('\n')}
</urlset>
`;
}

function NewsSiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Query active, published news for Google News crawler
  const query = `{
    "standard": *[_type in ["topStory", "localNews", "nationalNews", "entertainmentNews", "healthNews", "sportsNews"] && (!defined(active) || active == true) && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...100] {
      _type,
      slug,
      title,
      publishedAt
    },
    "latest": *[_type == "latestNews" && active == true && !(_id in path("drafts.**"))] | order(date desc)[0...50] {
      _type,
      "title": heading,
      "publishedAt": date
    }
  }`;

  try {
    const data = await sanityClient.fetch(query);
    const posts = [
      ...(data.standard || []),
      ...(data.latest || []).map((item: any) => ({ ...item, _type: 'latestNews' })),
    ];

    // Sort all posts descending by publication date
    posts.sort((a, b) => {
      const timeA = new Date(a.publishedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || 0).getTime();
      return timeB - timeA;
    });

    const xml = generateGoogleNewsSiteMap(posts);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=600');
    res.write(xml);
    res.end();
  } catch (error) {
    console.error('Error generating Google News sitemap:', error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
};

export default NewsSiteMap;
