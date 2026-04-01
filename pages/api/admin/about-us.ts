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

    try {
        if (method === 'GET') {
            // Fetch FRESH data for the admin panel (ignores the cache)
            const result = await adminSanityClient.fetch(`*[_type == "aboutUs"][0] {
                ...,
                md {
                    ...,
                    image {
                        ...,
                        "url": asset->url
                    }
                },
                executiveDirectors[] {
                    ...,
                    image {
                        ...,
                        "url": asset->url
                    }
                },
                directors[] {
                    ...,
                    image {
                        ...,
                        "url": asset->url
                    }
                },
                operators[] {
                    ...
                }
            }`);
            return res.status(200).json(result || { error: 'No about us content found' });
        }

        if (method !== 'POST') {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${method} Not Allowed`);
        }

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

        let result = null;
        if (existing) {
            console.log('Updating existing aboutUs document:', existing._id);
            result = await adminSanityClient
                .patch(existing._id)
                .set(payload)
                .commit();
        } else {
            console.log('Creating new aboutUs document');
            result = await adminSanityClient.create(payload);
        }

        // NO automatic clearCache() here.
        return res.status(existing ? 200 : 201).json(result);
    } catch (error: any) {
        console.error('About Us Admin API Error:', error);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
}
