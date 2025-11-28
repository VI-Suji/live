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

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        console.log('=== SITE SETTINGS SAVE REQUEST ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        // Check if settings document exists
        const existing = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);

        const settingsToSave = {
            liveStreamVisible: req.body.liveStreamVisible ?? true,
            heroSectionVisible: req.body.heroSectionVisible ?? true,
            advertisementsVisible: req.body.advertisementsVisible ?? true,
            latestNewsVisible: req.body.latestNewsVisible ?? true,
            topStoriesVisible: req.body.topStoriesVisible ?? true,
        };

        console.log('Settings to save:', JSON.stringify(settingsToSave, null, 2));

        let result;
        if (existing) {
            // Update existing
            console.log('Updating existing site settings:', existing._id);
            result = await sanityClient
                .patch(existing._id)
                .set(settingsToSave)
                .commit();
        } else {
            // Create new
            console.log('Creating new site settings');
            result = await sanityClient.create({
                _type: 'siteSettings',
                ...settingsToSave,
            });
        }


        console.log('Site settings saved successfully:', JSON.stringify(result, null, 2));
        console.log('=== END SAVE REQUEST ===');
        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error saving site settings:', error);
        return res.status(500).json({ error: error.message || 'Failed to save site settings' });
    }
}
