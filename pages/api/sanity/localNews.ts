import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Check if we should show all items (for admin) or only active (for public)
        const showAll = req.query.all === 'true';

        const query = showAll
            ? `*[_type == "localNews"] | order(order asc, publishedAt desc) {
                _id,
                title,
                "image": image.asset->url,
                description,
                publishedAt,
                order,
                active
              }`
            : `*[_type == "localNews" && active == true] | order(order asc, publishedAt desc) {
                _id,
                title,
                "image": image.asset->url,
                description,
                publishedAt,
                order,
                active
              }`;

        const localNews = await sanityClient.fetch(query);

        res.status(200).json(localNews);
    } catch (error) {
        console.error('Error fetching local news:', error);
        res.status(500).json({ error: 'Failed to fetch local news' });
    }
}
