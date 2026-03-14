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

    const MAX_ACTIVE = 50;

    // Helper: enforce 50-active cap — deactivate oldest items beyond the limit
    // protectId: the item that was just created/activated and must NEVER be deactivated
    const enforceActiveCap = async (protectId: string): Promise<string[]> => {
        const activeItems: { _id: string }[] = await sanityClient.fetch(
            `*[_type == "localNews" && active == true] | order(publishedAt desc) { _id }`
        );

        const deactivatedIds: string[] = [];
        if (activeItems.length > MAX_ACTIVE) {
            // Items beyond index 49 are the oldest — deactivate them
            const itemsToDeactivate = activeItems.slice(MAX_ACTIVE);
            for (const item of itemsToDeactivate) {
                // Never deactivate the item that was just created/activated
                if (item._id === protectId) continue;
                await sanityClient.patch(item._id).set({ active: false }).commit();
                deactivatedIds.push(item._id);
            }

            // If protected item was in the overflow, deactivate the item just before the cutoff instead
            if (deactivatedIds.length < itemsToDeactivate.length) {
                // Find the last item before the cutoff that isn't protected
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
            case 'POST':
                // Auto-calculate order: smallest current order - 1 (so new item is at the top)
                const bottomItem = await sanityClient.fetch(
                    `*[_type == "localNews"] | order(order asc) [0] { order }`
                );
                const nextOrder = (bottomItem?.order ?? 0) - 1;

                const newDoc = await sanityClient.create({
                    _type: 'localNews',
                    ...req.body,
                    order: nextOrder,
                    publishedAt: req.body.publishedAt || new Date().toISOString(),
                });

                // If new news is active, enforce the 50-active cap (protect this new item)
                let postDeactivated: string[] = [];
                if (req.body.active !== false) {
                    postDeactivated = await enforceActiveCap(newDoc._id);
                }
                return res.status(201).json({ ...newDoc, _deactivatedIds: postDeactivated });

            case 'PATCH':
                const { _id, ...updates } = req.body;

                const updatedDoc = await sanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();

                // If news was activated, enforce the 50-active cap (protect this item)
                let patchDeactivated: string[] = [];
                if (updates.active === true) {
                    patchDeactivated = await enforceActiveCap(_id);
                }
                return res.status(200).json({ ...updatedDoc, _deactivatedIds: patchDeactivated });

            case 'DELETE':
                const { id } = req.query;
                await sanityClient.delete(id as string);
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
