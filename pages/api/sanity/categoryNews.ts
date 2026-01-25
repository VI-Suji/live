import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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
            : `*[_type == "${type}" && active == true] | order(order asc, publishedAt desc) {
                _id,
                title,
                "image": image.asset->url,
                description,
                author,
                publishedAt,
                order,
                active
              }`;

        const news = await sanityClient.fetch(query);
        res.status(200).json(news);
    } catch (error) {
        console.error('Error fetching category news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
