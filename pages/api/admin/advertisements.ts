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

    try {
        switch (method) {
            case 'GET':
                const allAds = await sanityClient.fetch(`
                    *[_type == "advertisement"] | order(_createdAt desc) {
                        _id,
                        title,
                        position,
                        "image": image.asset->url,
                        "video": video.asset->url,
                        link,
                        active,
                        startDate,
                        endDate
                    }
                `);
                return res.status(200).json(allAds);

            case 'POST':
                const newDoc = await sanityClient.create({
                    _type: 'advertisement',
                    ...req.body,
                });
                return res.status(201).json(newDoc);

            case 'PATCH':
                const { _id, ...updates } = req.body;
                const updatedDoc = await sanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();
                return res.status(200).json(updatedDoc);

            case 'DELETE':
                const { id } = req.query;
                await sanityClient.delete(id as string);
                return res.status(200).json({ message: 'Deleted successfully' });

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
