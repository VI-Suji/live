import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const query = `*[_type == "latestNews" && active == true] | order(_createdAt desc)[0] {
      _id,
      heading,
      content,
      date,
      active
    }`;

        const latestNews = await sanityClient.fetch(query);

        if (!latestNews) {
            return res.status(404).json({ error: 'No active latest news found' });
        }

        res.status(200).json(latestNews);
    } catch (error) {
        console.error('Error fetching latest news:', error);
        res.status(500).json({ error: 'Failed to fetch latest news' });
    }
}
