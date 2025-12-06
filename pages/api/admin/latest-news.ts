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
            case 'POST':
                // Check if a latestNews document already exists
                const existing = await sanityClient.fetch(`*[_type == "latestNews"][0]`);

                if (existing) {
                    // Update existing document
                    console.log('Updating existing latest news:', existing._id);
                    console.log('Update data:', req.body);
                    const updatedDoc = await sanityClient
                        .patch(existing._id)
                        .set(req.body)
                        .commit();
                    console.log('Updated successfully:', updatedDoc);
                    return res.status(200).json(updatedDoc);
                } else {
                    // Create new document
                    console.log('Creating new latest news with data:', req.body);
                    const newDoc = await sanityClient.create({
                        _type: 'latestNews',
                        ...req.body,
                    });
                    console.log('Created successfully:', newDoc);
                    return res.status(201).json(newDoc);
                }

            case 'PATCH':
                const { _id, ...updates } = req.body;
                if (!_id) {
                    return res.status(400).json({ error: 'Missing _id for update' });
                }
                console.log('Patching latest news:', _id);
                console.log('Update data:', updates);
                const updatedDoc = await sanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();
                console.log('Patched successfully:', updatedDoc);
                return res.status(200).json(updatedDoc);

            case 'DELETE':
                const { id } = req.query;
                await sanityClient.delete(id as string);
                return res.status(200).json({ message: 'Deleted successfully' });

            default:
                res.setHeader('Allow', ['POST', 'PATCH', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('API Error:', error);
        console.error('Error details:', error.message);
        console.error('Error response:', error.response?.body);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            details: error.response?.body
        });
    }
}
