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
    const MAX_ACTIVE = 20;

    const enforceActiveCap = async (protectId: string): Promise<string[]> => {
        const activeItems: { _id: string }[] = await adminSanityClient.fetch(
            `*[_type == "nationalNews" && active == true] | order(publishedAt desc) { _id }`
        );

        const deactivatedIds: string[] = [];
        if (activeItems.length > MAX_ACTIVE) {
            const itemsToDeactivate = activeItems.slice(MAX_ACTIVE);
            for (const item of itemsToDeactivate) {
                if (item._id === protectId) continue;
                await adminSanityClient.patch(item._id).set({ active: false }).commit();
                deactivatedIds.push(item._id);
            }

            if (deactivatedIds.length < itemsToDeactivate.length) {
                for (let i = MAX_ACTIVE - 1; i >= 0; i--) {
                    if (activeItems[i]._id !== protectId) {
                        await adminSanityClient.patch(activeItems[i]._id).set({ active: false }).commit();
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
            case 'POST':
                const bottomItem = await adminSanityClient.fetch(
                    `*[_type == "nationalNews"] | order(order asc) [0] { order }`
                );
                const nextOrder = (bottomItem?.order ?? 0) - 1;

                const newDoc = await adminSanityClient.create({
                    _type: 'nationalNews',
                    ...req.body,
                    order: nextOrder,
                    publishedAt: req.body.publishedAt || new Date().toISOString(),
                });

                let postDeactivated: string[] = [];
                if (req.body.active !== false) {
                    postDeactivated = await enforceActiveCap(newDoc._id);
                }
                return res.status(201).json({ ...newDoc, _deactivatedIds: postDeactivated });

            case 'PATCH':
                const { _id, ...updates } = req.body;

                const updatedDoc = await adminSanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();

                let patchDeactivated: string[] = [];
                if (updates.active === true) {
                    patchDeactivated = await enforceActiveCap(_id);
                }
                return res.status(200).json({ ...updatedDoc, _deactivatedIds: patchDeactivated });

            case 'DELETE':
                const { id } = req.query;
                await adminSanityClient.delete(id as string);
                return res.status(200).json({ message: 'Deleted successfully' });

            default:
                res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
