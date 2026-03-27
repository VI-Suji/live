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
        let query = `count(*[_type == "latestNews" && active == true])`;
        if (ignoreId) {
            query = `count(*[_type == "latestNews" && active == true && _id != "${ignoreId}"])`;
        }
        return await adminSanityClient.fetch(query);
    };

    try {
        switch (method) {
            case 'POST':
                if (req.body.active !== false) {
                    const count = await checkActiveLimit();
                    if (count >= MAX_ACTIVE) {
                        return res.status(400).json({ error: 'Maximum 2 active items allowed. Please deactivate an existing item first.' });
                    }
                }
                
                const newDoc = await adminSanityClient.create({
                    _type: 'latestNews',
                    ...req.body,
                });
                return res.status(201).json(newDoc);

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

                const updatedDoc = await adminSanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();

                return res.status(200).json(updatedDoc);

            case 'DELETE':
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ error: 'Missing id for delete' });
                }
                await adminSanityClient.delete(id as string);
                return res.status(200).json({ message: 'Deleted successfully' });

            default:
                res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
