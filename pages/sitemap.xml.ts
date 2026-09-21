import { GetServerSideProps } from 'next';
import { sanityClient } from '../sanity/config';
import { slugify } from '../utils/slugify';

const EXTERNAL_DATA_URL = 'https://www.gramika.in';

const formatLastMod = (dateStr?: string) => {
  if (!dateStr) return new Date().toISOString();
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

function generateSiteMap(posts: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--Static Pages-->
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/privacy-policy</loc>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/terms-and-conditions</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>

     <!--Dynamic Story Pages-->
     ${posts
      .map(({ _type, slug, title, publishedAt }) => {
        const path = _type === 'topStory' ? 'story' : 'news';
        const finalSlug = (slug && slug.current) || slugify(title || '');
        if (!finalSlug || !title) return '';

        return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${path}/${finalSlug}`}</loc>
           <lastmod>${formatLastMod(publishedAt)}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `;
      })
      .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Only query active, published posts (exclude drafts and inactive items to avoid 404s)
  const query = `{
    "standard": *[_type in ["topStory", "localNews", "nationalNews", "entertainmentNews", "healthNews", "sportsNews"] && (!defined(active) || active == true) && !(_id in path("drafts.**"))] {
      _type,
      slug,
      title,
      publishedAt
    },
    "latest": *[_type == "latestNews" && active == true && !(_id in path("drafts.**"))] {
      _type,
      "title": heading,
      "publishedAt": date
    }
  }`;

  const data = await sanityClient.fetch(query);
  const posts = [...(data.standard || []), ...(data.latest || []).map((item: any) => ({ ...item, _type: 'latestNews' }))];

  // Generate the XML sitemap with active posts
  const sitemap = generateSiteMap(posts);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
