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
    const { all } = req.query;

    try {
        let result = null;

        switch (method) {
            case 'GET':
                 // Fetch FRESH data for the admin panel (ignores the cache)
                 const filter = all === 'true' ? '' : ' && active == true';
                 const query = `*[_type == "doctor"${filter}] | order(_createdAt desc) {
                    _id,
                    name,
                    specialty,
                    hospital,
                    location,
                    phone,
                    active,
                    "photo": photo.asset->url
                 }`;
                 result = await adminSanityClient.fetch(query);
                 return res.status(200).json(result);

            case 'POST':
                const newDoc = await adminSanityClient.create({
                    _type: 'doctor',
                    ...req.body,
                });
                result = newDoc;
                break;

            case 'PATCH':
                const { _id, ...updates } = req.body;
                const updatedDoc = await adminSanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();
                result = updatedDoc;
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
        return res.status(method === 'POST' ? 201 : 200).json(result);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
