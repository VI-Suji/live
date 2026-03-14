import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const ALLOWED_EMAIL = 'gramikaweb@gmail.com';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Fetch all local news items with negative order
        const items = await sanityClient.fetch(
            `*[_type == "localNews" && order < 0] { _id, order }`
        );

        const fixed: string[] = [];
        for (const item of items) {
            await sanityClient.patch(item._id).set({ order: Math.abs(item.order) }).commit();
            fixed.push(item._id);
        }

        return res.status(200).json({
            message: `Fixed ${fixed.length} items with negative orders`,
            fixedIds: fixed,
        });
    } catch (error) {
        console.error('Error fixing orders:', error);
        return res.status(500).json({ error: 'Failed to fix orders' });
    }
}
