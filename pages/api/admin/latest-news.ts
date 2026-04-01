import type { NextApiRequest, NextApiResponse } from 'next';
import { adminSanityClient } from '../../../sanity/config';
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

    const { method } = req;
    const MAX_ACTIVE = 2; // Latest news only shows 2

    const checkActiveLimit = async (ignoreId?: string) => {
        const today = new Date().toISOString().split('T')[0];
        // Only count items that are both 'active' AND not 'expired' (date >= today)
        let query = `count(*[_type == "latestNews" && active == true && date >= $today && !(_id in path("drafts.**"))])`;
        if (ignoreId) {
            query = `count(*[_type == "latestNews" && active == true && date >= $today && _id != "${ignoreId}" && !(_id in path("drafts.**"))])`;
        }
        return await adminSanityClient.fetch(query, { today });
    };

    try {
        let result = null;

        switch (method) {
            case 'GET':
                 // Fetch FRESH data for the admin panel (ignores the cache)
                 const query = `*[_type == "latestNews"] | order(date desc) {
                    _id,
                    heading,
                    content,
                    date,
                    active,
                    "image": image.asset->url
                 }`;
                 result = await adminSanityClient.fetch(query);
                 return res.status(200).json(result);

            case 'POST':
                if (req.body.active !== false) {
                    const count = await checkActiveLimit();
                    if (count >= MAX_ACTIVE) {
                        return res.status(400).json({ error: 'Maximum 2 active items allowed. Please deactivate an existing item first.' });
                    }
                }
                
                result = await adminSanityClient.create({
                    _type: 'latestNews',
                    ...req.body,
                });
                break;

            case 'PATCH':
                const { _id, ...updates } = req.body;
                if (!_id) {
                    return res.status(400).json({ error: 'Missing _id for update' });
                }

                if (updates.active === true) {
                    const count = await checkActiveLimit(_id);
                    if (count >= MAX_ACTIVE) {
                        return res.status(400).json({ error: 'Maximum 2 active items allowed. Please deactivate an existing item first.' });
                    }
                    // Auto-update the date to today when activating
                    updates.date = new Date().toISOString().split('T')[0];
                }

                result = await adminSanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();
                break;

            case 'DELETE':
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ error: 'Missing id for delete' });
                }
                await adminSanityClient.delete(id as string);
                result = { message: 'Deleted successfully' };
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }

        // NO automatic clearCache() here.
        // Frontend will stay cached for 2 hours unless manually synced.

        return res.status(method === 'POST' ? 201 : 200).json(result);
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
