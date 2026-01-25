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
            ? `*[_type == "nationalNews"] | order(order asc, publishedAt desc) {
                _id,
                title,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`
            : `*[_type == "nationalNews" && active == true] | order(order asc, publishedAt desc) {
                _id,
                title,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`;

        const nationalNews = await sanityClient.fetch(query);

        res.status(200).json(nationalNews);
    } catch (error) {
        console.error('Error fetching national news:', error);
        res.status(500).json({ error: 'Failed to fetch national news' });
    }
}
