import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { all } = req.query;
    const filter = all === 'true' ? '' : ' && active == true';
    const limit = all === 'true' ? '' : ' [0...2]';

    try {
        const query = `*[_type == "latestNews"${filter}] | order(date desc)${limit} {
            _id,
            heading,
            content,
            date,
            active,
            "image": image.asset->url
        }`;

        const latestNewsList = await sanityClient.fetch(query);

        if (!latestNewsList || latestNewsList.length === 0) {
            return res.status(404).json({ error: 'No active latest news found' });
        }

        res.status(200).json(latestNewsList);
    } catch (error) {
        console.error('Error fetching latest news:', error);
        res.status(500).json({ error: 'Failed to fetch latest news' });
    }
}
