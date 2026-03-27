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

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Remove metadata fields if they were accidentally included in req.body
        const { _id, _rev, _createdAt, _updatedAt, ...cleanData } = req.body;

        // Ensure we are targeting the 'aboutUs' type
        const payload = {
            ...cleanData,
            _type: 'aboutUs'
        };

        console.log('Processed API Save for aboutUs:', JSON.stringify(payload, null, 2));

        // Check if an aboutUs document already exists
        const existing = await adminSanityClient.fetch(`*[_type == "aboutUs"][0]`);

        if (existing) {
            console.log('Updating existing aboutUs document:', existing._id);
            const updatedDoc = await adminSanityClient
                .patch(existing._id)
                .set(payload)
                .commit();
            return res.status(200).json(updatedDoc);
        } else {
            console.log('Creating new aboutUs document');
            const newDoc = await adminSanityClient.create(payload);
            return res.status(201).json(newDoc);
        }
    } catch (error: any) {
        console.error('About Us Admin API Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
}
