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

    const { method } = req;
    const MAX_ACTIVE = 20;

    const enforceActiveCap = async (protectId: string): Promise<string[]> => {
        // Breaking news is ordered by priority asc then createdAt desc
        const activeItems: { _id: string }[] = await sanityClient.fetch(
            `*[_type == "breakingNews" && active == true] | order(priority asc, _createdAt desc) { _id }`
        );

        const deactivatedIds: string[] = [];
        if (activeItems.length > MAX_ACTIVE) {
            const itemsToDeactivate = activeItems.slice(MAX_ACTIVE);
            for (const item of itemsToDeactivate) {
                if (item._id === protectId) continue;
                await sanityClient.patch(item._id).set({ active: false }).commit();
                deactivatedIds.push(item._id);
            }

            if (deactivatedIds.length < itemsToDeactivate.length) {
                for (let i = MAX_ACTIVE - 1; i >= 0; i--) {
                    if (activeItems[i]._id !== protectId) {
                        await sanityClient.patch(activeItems[i]._id).set({ active: false }).commit();
                        deactivatedIds.push(activeItems[i]._id);
                        break;
                    }
                }
            }
        }
        return deactivatedIds;
    };

    try {
        switch (method) {
            case 'GET':
                const allNews = await sanityClient.fetch(`
                    *[_type == "breakingNews"] | order(priority asc, _createdAt desc) {
                        _id,
                        title,
                        link,
                        active,
                        priority,
                        startDate,
                        expiryDate
                    }
                `);
                return res.status(200).json(allNews);

            case 'POST':
                const newDoc = await sanityClient.create({
                    _type: 'breakingNews',
                    ...req.body,
                });
                
                let postDeactivated: string[] = [];
                if (req.body.active !== false) {
                    postDeactivated = await enforceActiveCap(newDoc._id);
                }
                return res.status(201).json({ ...newDoc, _deactivatedIds: postDeactivated });

            case 'PATCH':
                const { _id, ...updates } = req.body;
                if (!_id) {
                    return res.status(400).json({ error: 'Missing _id for update' });
                }

                const updatedDoc = await sanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();

                let patchDeactivated: string[] = [];
                if (updates.active === true || updates.priority !== undefined) {
                    patchDeactivated = await enforceActiveCap(_id);
                }
                return res.status(200).json({ ...updatedDoc, _deactivatedIds: patchDeactivated });

            case 'DELETE':
                const { id } = req.query;
                await sanityClient.delete(id as string);
                return res.status(200).json({ message: 'Deleted successfully' });

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
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
