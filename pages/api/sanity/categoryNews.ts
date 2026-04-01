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
        const { type } = req.query;
        if (!type || !['entertainmentNews', 'healthNews', 'sportsNews'].includes(type as string)) {
            return res.status(400).json({ error: 'Invalid news type' });
        }

        const showAll = req.query.all === 'true';

        const query = showAll
            ? `*[_type == "${type}"] | order(order asc, publishedAt desc) {
                _id,
                title,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`
            : `*[_type == "${type}" && active == true] | order(order asc, publishedAt desc) [0..49] {
                _id,
                title,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`;

        const newsList = await sanityClient.fetch(query);
        res.status(200).json(newsList);
    } catch (error) {
        console.error('Error fetching category news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
