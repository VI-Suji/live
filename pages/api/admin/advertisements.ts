import type { NextApiRequest, NextApiResponse } from 'next';
import { adminSanityClient } from '../../../sanity/config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { del } from '@vercel/blob';

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
                const allAds = await adminSanityClient.fetch(`
                    *[_type == "advertisement"] | order(_createdAt desc) {
                        _id,
                        title,
                        position,
                        "image": image.asset->url,
                        "video": video.asset->url,
                        videoUrl,
                        link,
                        active,
                        startDate,
                        endDate
                    }
                `);
                return res.status(200).json(allAds);

            case 'POST':
                const newDoc = await adminSanityClient.create({
                    _type: 'advertisement',
                    ...req.body,
                });
                return res.status(201).json(newDoc);

            case 'PATCH':
                const { _id, ...updates } = req.body;
                const updatedDoc = await adminSanityClient
                    .patch(_id)
                    .set(updates)
                    .commit();
                return res.status(200).json(updatedDoc);

            case 'DELETE':
                const { id } = req.query;
                
                // 1. Fetch the doc to check for videoUrl
                const doc = await adminSanityClient.fetch(`*[_id == $id][0]{videoUrl}`, { id });
                
                // 2. If it has a Vercel Blob URL, delete it from Vercel
                if (doc?.videoUrl) {
                    try {
                        console.log('Deleting blob from Vercel:', doc.videoUrl);
                        await del(doc.videoUrl);
                    } catch (blobError) {
                        console.error('Failed to delete blob from Vercel:', blobError);
                        // We continue anyway so the Sanity record is deleted even if blob fails
                    }
                }

                // 3. Delete from Sanity
                await adminSanityClient.delete(id as string);
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
