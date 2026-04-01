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
    const { type, all } = req.query;

    if (!type || !['entertainmentNews', 'healthNews', 'sportsNews'].includes(type as string)) {
        return res.status(400).json({ error: 'Invalid news type' });
    }

    const newsType = type as string;
    const MAX_ACTIVE = 20;

    const enforceActiveCap = async (protectId: string): Promise<string[]> => {
        // EXPLICITLY filter out drafts to avoid double-counting or deactivating drafts
        const activeItems: { _id: string }[] = await adminSanityClient.fetch(
            `*[_type == "${newsType}" && active == true && !(_id in path("drafts.**"))] | order(publishedAt desc) { _id }`
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
        let result = null;

        switch (method) {
            case 'GET':
                // Fetch FRESH data for the admin panel (ignores the cache)
                const filter = all === 'true' ? '' : ' && active == true';
                const query = `*[_type == "${newsType}"${filter}] | order(publishedAt desc) {
                    _id,
                    title,
                    "image": image.asset->url,
                    description,
                    author,
                    publishedAt,
                    order,
                    active
                }`;
                result = await adminSanityClient.fetch(query);
                return res.status(200).json(result);

            case 'POST':
                const bottomItem = await adminSanityClient.fetch(
                    `*[_type == "${newsType}"] | order(order asc) [0] { order }`
                );
                const nextOrder = (bottomItem?.order ?? 0) - 1;

                const newDoc = await adminSanityClient.create({
                    _type: newsType,
                    ...req.body,
                    order: nextOrder,
                    publishedAt: req.body.publishedAt || new Date().toISOString(),
                });

                let postDeactivated: string[] = [];
                if (req.body.active !== false) {
                    postDeactivated = await enforceActiveCap(newDoc._id);
                }
                result = { ...newDoc, _deactivatedIds: postDeactivated };
                break;

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
                result = { ...updatedDoc, _deactivatedIds: patchDeactivated };
                break;

            case 'DELETE':
                const { id } = req.query;
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
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
