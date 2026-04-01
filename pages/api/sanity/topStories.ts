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
            ? `*[_type == "topStory"] | order(publishedAt desc) {
                _id,
                title,
                slug,
                author,
                "mainImage": mainImage.asset->url,
                excerpt,
                body,
                publishedAt,
                featured,
                category,
                active
              }`
            : `*[_type == "topStory" && active == true] | order(publishedAt desc) [0..49] {
                _id,
                title,
                slug,
                author,
                "mainImage": mainImage.asset->url,
                excerpt,
                body,
                publishedAt,
                featured,
                category,
                active
              }`;

        const posts = await sanityClient.fetch(query);

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching top stories:', error);
        res.status(500).json({ error: 'Failed to fetch top stories' });
    }
}
