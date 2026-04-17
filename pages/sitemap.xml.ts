import { GetServerSideProps } from 'next';
import { sanityClient } from '../sanity/config';

const EXTERNAL_DATA_URL = 'https://www.gramika.in';

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
                const slugify = (text: string) => {
                    return text
                        .toLowerCase()
                        .trim()
                        .replace(/[^\u0D00-\u0D7F\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .substring(0, 60);
                };

                const path = _type === 'topStory' ? 'story' : 'news';
                const finalSlug = (slug && slug.current) || slugify(title || '');
                if (!finalSlug) return '';

                return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${path}/${finalSlug}`}</loc>
           <lastmod>${publishedAt || new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
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
    // We make an API call to gather the URLs for our site
    const query = `*[_type in ["topStory", "localNews", "nationalNews", "entertainmentNews", "healthNews", "sportsNews"]] {
    slug,
    title,
    publishedAt
  }`;

    const posts = await sanityClient.fetch(query);

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default SiteMap;
