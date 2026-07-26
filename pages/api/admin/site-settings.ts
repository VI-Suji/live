import type { NextApiRequest, NextApiResponse } from 'next';
import { adminSanityClient } from '../../../sanity/config';
import { clearCache } from '../../../sanity/cache';
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
        console.log('=== SITE SETTINGS SAVE REQUEST ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        // Check if settings documents exist
        const existingDocs = await adminSanityClient.fetch(`*[_type == "siteSettings"] | order(_updatedAt desc)`);

        const settingsToSave = {
            liveStreamVisible: req.body.liveStreamVisible ?? true,
            heroSectionVisible: req.body.heroSectionVisible ?? true,
            advertisementsVisible: req.body.advertisementsVisible ?? true,
            latestNewsVisible: req.body.latestNewsVisible ?? true,
            topStoriesVisible: req.body.topStoriesVisible ?? true,
            headerImages: req.body.headerImages,
            rotationInterval: req.body.rotationInterval
        };

        console.log('Settings to save:', JSON.stringify(settingsToSave, null, 2));

        let result;
        if (existingDocs && existingDocs.length > 0) {
            const primaryDoc = existingDocs[0];
            console.log('Updating existing site settings:', primaryDoc._id);
            result = await adminSanityClient
                .patch(primaryDoc._id)
                .set(settingsToSave)
                .commit();

            // Delete any duplicate siteSettings documents if present
            if (existingDocs.length > 1) {
                for (let i = 1; i < existingDocs.length; i++) {
                    console.log('Deleting duplicate siteSettings doc:', existingDocs[i]._id);
                    await adminSanityClient.delete(existingDocs[i]._id).catch(err => {
                        console.error('Error deleting duplicate doc:', err);
                    });
                }
            }
        } else {
            console.log('Creating new site settings');
            result = await adminSanityClient.create({
                _id: 'siteSettings',
                _type: 'siteSettings',
                ...settingsToSave,
            });
        }

        // Invalidate in-memory server cache so changes take effect immediately
        clearCache();

        console.log('Site settings saved successfully:', JSON.stringify(result, null, 2));
        console.log('=== END SAVE REQUEST ===');
        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error saving site settings:', error);
        return res.status(500).json({ error: error.message || 'Failed to save site settings' });
    }
}

