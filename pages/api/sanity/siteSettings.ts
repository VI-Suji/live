import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const query = `*[_type == "siteSettings"][0] {
            _id,
            liveStreamVisible,
            heroSectionVisible,
            advertisementsVisible,
            latestNewsVisible,
            topStoriesVisible
        }`;

        const settings = await sanityClient.fetch(query);

        if (!settings) {
            // Return default settings if none exist
            return res.status(200).json({
                liveStreamVisible: true,
                heroSectionVisible: true,
                advertisementsVisible: true,
                latestNewsVisible: true,
                topStoriesVisible: true
            });
        }

        res.status(200).json(settings);
    } catch (error) {
        console.error('Error fetching site settings:', error);
        res.status(500).json({ error: 'Failed to fetch site settings' });
    }
}
