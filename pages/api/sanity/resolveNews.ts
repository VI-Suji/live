import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityLiveClient } from '../../../sanity/config';
import { getNewsSharePath } from '../../../utils/slugify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end();
    }

    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).json({ error: 'Missing id' });
    }

    try {
        const doc = await sanityLiveClient.fetch<{ title?: string; heading?: string } | null>(
            `*[_id == $id][0]{ title, "heading": heading }`,
            { id }
        );

        if (!doc) {
            return res.status(404).json({ error: 'Not found' });
        }

        const title = doc.title || doc.heading;
        if (!title) {
            return res.status(404).json({ error: 'Not found' });
        }

        return res.status(200).json({ path: getNewsSharePath(title) });
    } catch (error) {
        console.error('resolveNews error:', error);
        return res.status(500).json({ error: 'Failed to resolve news' });
    }
}
