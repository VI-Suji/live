import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const ALLOWED_EMAIL = 'gramikaweb@gmail.com';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { method } = req;

    try {
        switch (method) {
            case 'POST':
                // Create new top story
                const newStory = await sanityClient.create({
                    _type: 'topStory',
                    ...req.body,
                });
                return res.status(201).json(newStory);

            case 'PATCH':
                // Update existing story
                const { _id, ...updates } = req.body;
                const updatedStory = await sanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();
                return res.status(200).json(updatedStory);

            case 'DELETE':
                // Delete story
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
