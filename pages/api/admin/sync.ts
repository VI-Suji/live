import type { NextApiRequest, NextApiResponse } from 'next';
import { clearCache } from '../../../sanity/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Instantly force clearing of the Sanity fetch cache and signal a sync event
        // to bypass the Sanity CDN for the next 60 seconds (freshness window).
        clearCache();

        return res.status(200).json({ message: 'Frontend and Backend synced successfully!' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error during sync' });
    }
}
