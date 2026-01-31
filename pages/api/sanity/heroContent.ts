import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const query = `*[_type == "heroSection"][0] {
      _id,
      greeting,
      tagline
    }`;

        const heroContent = await sanityClient.fetch(query);

        if (!heroContent) {
            return res.status(404).json({ error: 'Hero section content not found' });
        }

        res.status(200).json(heroContent);
    } catch (error) {
        console.error('Error fetching hero content:', error);
        res.status(500).json({ error: 'Failed to fetch hero content' });
    }
}
