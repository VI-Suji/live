import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';
import { setCacheHeaders } from '../../../sanity/cache';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Prevent browser caching so Sync Now works instantly for users (by consulting the server cache)
    setCacheHeaders(res);

    try {
        // Check if we should show all items (for admin) or only active (for public)
        const showAll = req.query.all === 'true';

        const query = showAll
            ? `*[_type == "localNews"] | order(order asc, publishedAt desc) {
                _id,
                title,
                scrollTitle,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`
            : `*[_type == "localNews" && active == true] | order(order asc, publishedAt desc) [0..49] {
                _id,
                title,
                scrollTitle,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`;

        const localNewsList = await sanityClient.fetch(query);

        res.status(200).json(localNewsList);
    } catch (error) {
        console.error('Error fetching local news:', error);
        res.status(500).json({ error: 'Failed to fetch local news' });
    }
}
